using Application.Core.Result;
using Application.Interface;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Followers;

public class FollowToggle
{
    public class Command : IRequest<Result<Unit>>
    {
        public string TargetUserName { get; set; }
    }

    public class Handler : IRequestHandler<Command, Result<Unit>>
    {
        private readonly DataContext _context;
        private readonly IUserAccessor _userAccessor;

        public Handler(DataContext context, IUserAccessor userAccessor)
        {
            _context = context;
            _userAccessor = userAccessor;
        }

        public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
        {
            var sourceUser = await _context.Users.FirstOrDefaultAsync(
                u => u.UserName == _userAccessor.GetUserName(),
                cancellationToken
            );

            if (sourceUser == null)
            {
                return Result<Unit>.Failure("Invalid host user identifier");
            }

            var targetUser = await _context.Users.FirstOrDefaultAsync(
                u => u.UserName == request.TargetUserName,
                cancellationToken
            );

            if (targetUser == null)
            {
                return Result<Unit>.Failure("Invalid target user identifier");
            }

            var following = await _context.UserFollowings.FindAsync(
                new object[] { sourceUser.Id, targetUser.Id },
                cancellationToken: cancellationToken
            );

            if (following == null)
            {
                following = new UserFollowing { Source = sourceUser, Target = targetUser };
                _context.UserFollowings.Add(following);
            }
            else
            {
                _context.UserFollowings.Remove(following);
            }

            var result = await _context.SaveChangesAsync(cancellationToken) > 0;

            return result
                ? Result<Unit>.Success(Unit.Value)
                : Result<Unit>.Failure("Failed to update the follow request");
        }
    }
}
