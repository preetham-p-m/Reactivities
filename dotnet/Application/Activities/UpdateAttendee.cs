using Application.Core.Result;
using Application.Interface;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities;

public class UpdateAttendee
{
    public class Command : IRequest<Result<Unit>>
    {
        public Guid Id { get; set; }
    }

    public class Handler : IRequestHandler<Command, Result<Unit>>
    {
        private readonly IUserAccessor _userAccessor;
        private readonly DataContext _context;

        public Handler(DataContext context, IUserAccessor userAccessor)
        {
            _context = context;
            _userAccessor = userAccessor;
        }

        public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
        {
            var activity = await _context.Activities
                .Include(a => a.Attendees)
                .ThenInclude(aa => aa.User)
                .SingleOrDefaultAsync(
                    a => a.Id == request.Id,
                    cancellationToken: cancellationToken
                );

            if (activity == null)
                return null;

            var user = await _context.Users.FirstOrDefaultAsync(
                u => u.UserName == _userAccessor.GetUserName(),
                cancellationToken
            );

            if (user == null)
                return null;

            var hostUserName = activity.Attendees.SingleOrDefault(h => h.IsHost).User.UserName;

            var attendeeUser = activity.Attendees.SingleOrDefault(
                a => a.User.UserName == user.UserName
            );

            if (attendeeUser != null && hostUserName == user.UserName)
                activity.IsCancelled = !activity.IsCancelled;

            if (attendeeUser != null && hostUserName != user.UserName)
                activity.Attendees.Remove(attendeeUser);

            if (attendeeUser == null)
            {
                var attendee = new ActivityUser
                {
                    Activity = activity,
                    User = user,
                    IsHost = false
                };
                activity.Attendees.Add(attendee);
            }

            var result = await _context.SaveChangesAsync(cancellationToken) > 0;

            return result
                ? Result<Unit>.Success(Unit.Value)
                : Result<Unit>.Failure("Internal Server Error");
        }
    }
}
