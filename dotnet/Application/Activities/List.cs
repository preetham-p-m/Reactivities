using Application.Core.Pagination;
using Application.Core.Result;
using Application.DTO;
using Application.Interface;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Persistence;

namespace Application.Activities;

public class List
{
    public class Query : IRequest<Result<PagedList<ActivityDto>>>
    {
        public ActivityQuery ActivityQuery { get; set; }
    }

    public class Handler : IRequestHandler<Query, Result<PagedList<ActivityDto>>>
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        private readonly IUserAccessor _userAccessor;

        public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor)
        {
            _userAccessor = userAccessor;
            _mapper = mapper;
            _context = context;
        }

        public async Task<Result<PagedList<ActivityDto>>> Handle(
            Query request,
            CancellationToken cancellationToken
        )
        {
            var query = _context.Activities
                .Where(d => d.Date >= request.ActivityQuery.StartDate)
                .OrderBy(d => d.Date)
                .ProjectTo<ActivityDto>(
                    _mapper.ConfigurationProvider,
                    new { currentUserName = _userAccessor.GetUserName() }
                )
                .AsQueryable();

            if (request.ActivityQuery.IsGoing && !request.ActivityQuery.IsHost)
            {
                query = query.Where(
                    u => u.Attendees.Any(a => a.UserName == _userAccessor.GetUserName())
                );
            }
            if (!request.ActivityQuery.IsGoing && request.ActivityQuery.IsHost)
            {
                query = query.Where(u => u.HostUserName == _userAccessor.GetUserName());
            }

            return Result<PagedList<ActivityDto>>.Success(
                await PagedList<ActivityDto>.CreateAsync(
                    query,
                    request.ActivityQuery.PageNumber,
                    request.ActivityQuery.PageSize
                )
            );
        }
    }
}
