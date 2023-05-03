using Domain;
using MediatR;
using Persistence;

namespace Application.Activities;

public class Create
{
    public class Commnad : IRequest
    {
        public Activity Activity { get; set; }
    }

    public class Handler : IRequestHandler<Commnad>
    {
        private readonly DataContext _context;
        public Handler(DataContext context)
        {
            _context = context;
        }

        public async Task<Unit> Handle(Commnad request, CancellationToken cancellationToken)
        {
            _context.Activities.Add(request.Activity);
            await _context.SaveChangesAsync(cancellationToken);
            return Unit.Value;
        }
    }
}