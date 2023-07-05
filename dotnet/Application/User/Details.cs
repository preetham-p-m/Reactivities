using Application.Core.Result;
using Application.DTO;
using Application.Interface;
using AutoMapper;
using AutoMapper.Internal.Mappers;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.User;

public class Details
{
    public class Query : IRequest<Result<UserDto>>
    {
        public string UserName { get; set; }
    }

    public class Handler : IRequestHandler<Query, Result<UserDto>>
    {
        private readonly IMapper _mapper;
        public readonly DataContext _context;
        public readonly IUserAccessor _userAccessor;

        public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor)
        {
            _context = context;
            _mapper = mapper;
            _userAccessor = userAccessor;
        }

        public async Task<Result<UserDto>> Handle(
            Query request,
            CancellationToken cancellationToken
        )
        {
            var userDto = await _context.Users
                .ProjectTo<UserDto>(
                    _mapper.ConfigurationProvider,
                    new { currentUserName = _userAccessor.GetUserName() }
                )
                .FirstOrDefaultAsync(u => u.UserName == request.UserName, cancellationToken);

            return userDto == null
                ? Result<UserDto>.Failure("Unable to fetch the data")
                : Result<UserDto>.Success(userDto);
        }
    }
}
