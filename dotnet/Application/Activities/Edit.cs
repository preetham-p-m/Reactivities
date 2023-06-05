using AutoMapper;
using Application.Core.Result;
using Application.Core.Validator;
using Domain;
using MediatR;
using Persistence;

namespace Application.Activities;

public class Edit
{
    public class Command : IRequest<Result<Unit>>
    {
        public Activity Activity { get; set; }
    }

    public class Handler : IRequestHandler<Command, Result<Unit>>
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public Handler(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
        {
            var validaor = new ActivityValidator();
            validaor.Validate(request.Activity);

            var activity = await _context.Activities.FindAsync(
                new object[] { request.Activity.Id },
                cancellationToken: cancellationToken
            );

            if (activity == null)
                return null;

            _mapper.Map(request.Activity, activity);
            var result = await _context.SaveChangesAsync(cancellationToken) > 0;

            if (!result)
                return Result<Unit>.Failure(
                    "Looks like there is no change in fileds, unable to Update Activity"
                );

            return Result<Unit>.Success(Unit.Value);
        }
    }
}
