using Application.Core.Result;
using Application.Interface;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Media.Photos;

public class Delete
{
    public class Command : IRequest<Result<Unit>>
    {
        public string PublicId { get; set; }
    }

    public class Handler : IRequestHandler<Command, Result<Unit>>
    {
        private readonly IUserAccessor _userAccessor;
        private readonly IMediaAccessor _mediaAccessor;
        private readonly DataContext _context;

        public Handler(
            DataContext context,
            IUserAccessor userAccessor,
            IMediaAccessor mediaAccessor
        )
        {
            _context = context;
            _mediaAccessor = mediaAccessor;
            _userAccessor = userAccessor;
        }

        public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
        {
            var user = _context.Users
                .Include(u => u.Photos)
                .FirstOrDefault(u => u.UserName == _userAccessor.GetUserName());

            if (user == null)
                return null;

            var photo = user.Photos.FirstOrDefault(p => p.Id == request.PublicId);

            if (photo == null)
            {
                return null;
            }

            if (photo.IsMain)
            {
                return Result<Unit>.Failure("Cannot delete main Image");
            }

            var deleteResult = await _mediaAccessor.DeletePhoto(photo.Id);

            if (deleteResult != "ok")
            {
                return Result<Unit>.Failure("Unable to delete the Photo from server");
            }

            user.Photos.Remove(photo);
            var result = await _context.SaveChangesAsync(cancellationToken) > 0;

            return result
                ? Result<Unit>.Success(Unit.Value)
                : Result<Unit>.Failure("Unable to delete the Photo");
        }
    }
}
