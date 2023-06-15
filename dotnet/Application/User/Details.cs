using Application.Core.Result;
using Application.DTO;
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

        public Handler(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<Result<UserDto>> Handle(
            Query request,
            CancellationToken cancellationToken
        )
        {
            var userDto = await _context.Users
                .ProjectTo<UserDto>(_mapper.ConfigurationProvider)
                .FirstOrDefaultAsync(u => u.UserName == request.UserName, cancellationToken);

            return userDto == null
                ? Result<UserDto>.Failure("Ubable to fetch the data")
                : Result<UserDto>.Success(userDto);
        }
    }
}
