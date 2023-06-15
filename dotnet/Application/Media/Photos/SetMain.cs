using Application.Core.Result;
using Application.Interface;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Media.Photos;

public class SetMain
{
    public class Command : IRequest<Result<Unit>>
    {
        public string Id { get; set; }
    }

    public class Handler : IRequestHandler<Command, Result<Unit>>
    {
        private readonly DataContext _context;
        private readonly IUserAccessor _userAccessor;

        public Handler(DataContext context, IUserAccessor userAccessor)
        {
            _userAccessor = userAccessor;
            _context = context;
        }

        public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
        {
            var user = await _context.Users
                .Include(u => u.Photos)
                .FirstOrDefaultAsync(
                    x => x.UserName == _userAccessor.GetUserName(),
                    cancellationToken
                );

            if (user == null)
            {
                return null;
            }

            var photo = user.Photos.FirstOrDefault(p => p.Id == request.Id);

            if (photo == null)
            {
                return Result<Unit>.Failure("Photo doesn't exist");
            }

            var currentMainPhoto = user.Photos.FirstOrDefault(p => p.IsMain);

            if (currentMainPhoto != null)
            {
                currentMainPhoto.IsMain = false;
            }

            photo.IsMain = true;
            var result = await _context.SaveChangesAsync(cancellationToken) > 0;

            return result
                ? Result<Unit>.Success(Unit.Value)
                : Result<Unit>.Failure("Something went wrong");
        }
    }
}
