using Application.Core.Result;
using Application.Core.Validator;
using Application.Interface;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities;

public class Create
{
    public class Command : IRequest<Result<Unit>>
    {
        public Activity Activity { get; set; }
    }

    public class CommandValidator : AbstractValidator<Command>
    {
        public CommandValidator()
        {
            RuleFor(x => x.Activity).SetValidator(new ActivityValidator());
        }
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
            var user = await _context.Users.FirstOrDefaultAsync(
                u => u.UserName == _userAccessor.GetUserName(),
                cancellationToken: cancellationToken
            );

            var attendee = new ActivityUser
            {
                Activity = request.Activity,
                User = user,
                IsHost = true
            };

            request.Activity.Attendees.Add(attendee);

            _context.Activities.Add(request.Activity);
            var result = await _context.SaveChangesAsync(cancellationToken);

            return result > 0
                ? Result<Unit>.Success(Unit.Value)
                : Result<Unit>.Failure("Failed to create Activity");
        }
    }
}
