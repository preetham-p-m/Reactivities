using Application.Core.Result;
using Application.Interface;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Media.Photos;

public class Add
{
    public class Command : IRequest<Result<Photo>>
    {
        public IFormFile File { get; set; }
    }

    public class Handler : IRequestHandler<Command, Result<Photo>>
    {
        private readonly IMediaAccessor _mediaAccessor;
        public readonly DataContext _context;
        public readonly IUserAccessor _userAccessor;

        public Handler(
            DataContext context,
            IUserAccessor userAccessor,
            IMediaAccessor mediaAccessor
        )
        {
            _context = context;
            _userAccessor = userAccessor;
            _mediaAccessor = mediaAccessor;
        }

        public async Task<Result<Photo>> Handle(
            Command request,
            CancellationToken cancellationToken
        )
        {
            var user = await _context.Users
                .Include(u => u.Photos)
                .FirstOrDefaultAsync(
                    u => u.UserName == _userAccessor.GetUserName(),
                    cancellationToken
                );

            if (user == null)
            {
                return null;
            }

            var photoUploadResult = await _mediaAccessor.AddPhoto(request.File);

            var photo = new Photo { Url = photoUploadResult.Url, Id = photoUploadResult.PublicId };

            if (!user.Photos.Any(p => p.IsMain))
            {
                photo.IsMain = true;
            }

            user.Photos.Add(photo);

            var result = await _context.SaveChangesAsync(cancellationToken) > 0;

            return result
                ? Result<Photo>.Success(photo)
                : Result<Photo>.Failure("Error uploading the photo");
        }
    }
}
