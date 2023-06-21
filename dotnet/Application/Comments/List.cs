using Application.Core.Result;
using Application.DTO;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Comments;

public class List
{
    public class Query : IRequest<Result<List<CommentDto>>>
    {
        public Guid ActivityId { get; set; }
    }

    public class Handler : IRequestHandler<Query, Result<List<CommentDto>>>
    {
        private readonly IMapper _mapper;
        private readonly DataContext _dataContext;

        public Handler(DataContext dataContext, IMapper mapper)
        {
            _dataContext = dataContext;
            _mapper = mapper;
        }

        public async Task<Result<List<CommentDto>>> Handle(
            Query request,
            CancellationToken cancellationToken
        )
        {
            var comments = await _dataContext.Comments
                .Where(c => c.Activity.Id == request.ActivityId)
                .ProjectTo<CommentDto>(_mapper.ConfigurationProvider)
                .OrderByDescending(x => x.CreatedAt)
                .ToListAsync(cancellationToken);

            return Result<List<CommentDto>>.Success(comments);
        }
    }
}
