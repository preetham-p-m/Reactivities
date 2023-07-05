using Application.Core.Constants;
using Application.Core.Result;
using Application.DTO;
using Application.Interface;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Followers;

public class List
{
    public class Query : IRequest<Result<List<UserDto>>>
    {
        public string Predicate { get; set; }
        public string UserName { get; set; }
    }

    public class Handler : IRequestHandler<Query, Result<List<UserDto>>>
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        private readonly IUserAccessor _userAccessor;

        public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor)
        {
            _context = context;
            _mapper = mapper;
            _userAccessor = userAccessor;
        }

        public async Task<Result<List<UserDto>>> Handle(
            Query request,
            CancellationToken cancellationToken
        )
        {
            if (
                request.Predicate != FollowUser.Followers
                && request.Predicate != FollowUser.Following
            )
            {
                return null;
            }

            var profiles = new List<UserDto>();
            switch (request.Predicate)
            {
                case FollowUser.Followers:
                    profiles = await _context.UserFollowings
                        .Where(x => x.Target.UserName == request.UserName)
                        .Select(u => u.Source)
                        .ProjectTo<UserDto>(
                            _mapper.ConfigurationProvider,
                            new { currentUserName = _userAccessor.GetUserName() }
                        )
                        .ToListAsync(cancellationToken);
                    break;

                case FollowUser.Following:
                    profiles = await _context.UserFollowings
                        .Where(x => x.Source.UserName == request.UserName)
                        .Select(u => u.Target)
                        .ProjectTo<UserDto>(
                            _mapper.ConfigurationProvider,
                            new { currentUserName = _userAccessor.GetUserName() }
                        )
                        .ToListAsync(cancellationToken);
                    break;
            }

            return Result<List<UserDto>>.Success(profiles);
        }
    }
}
