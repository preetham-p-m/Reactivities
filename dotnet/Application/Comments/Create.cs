using Application.Core.Result;
using Application.DTO;
using Application.Interface;
using AutoMapper;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Comments;

public class Create
{
    public class Command : IRequest<Result<CommentDto>>
    {
        public string Body { get; set; }
        public Guid ActivityId { get; set; }
    }

    public class CommandValidator : AbstractValidator<Command>
    {
        public CommandValidator()
        {
            RuleFor(x => x.Body).NotEmpty();
        }
    }

    public class Handler : IRequestHandler<Command, Result<CommentDto>>
    {
        private readonly IMapper _mapper;
        private readonly IUserAccessor _userAccessor;
        private readonly DataContext _dataContext;

        public Handler(DataContext dataContext, IMapper mapper, IUserAccessor userAccessor)
        {
            _dataContext = dataContext;
            _userAccessor = userAccessor;
            _mapper = mapper;
        }

        public async Task<Result<CommentDto>> Handle(
            Command request,
            CancellationToken cancellationToken
        )
        {
            var activity = await _dataContext.Activities.FirstOrDefaultAsync(
                a => a.Id == request.ActivityId,
                cancellationToken
            );

            if (activity == null)
            {
                return null;
            }

            var user = await _dataContext.Users
                .Include(u => u.Photos)
                .SingleOrDefaultAsync(
                    u => u.UserName == _userAccessor.GetUserName(),
                    cancellationToken
                );

            var comment = new Comment
            {
                Author = user,
                Activity = activity,
                Body = request.Body
            };

            _dataContext.Comments.Add(comment);

            var success = await _dataContext.SaveChangesAsync(cancellationToken) > 0;

            return success
                ? Result<CommentDto>.Success(_mapper.Map<CommentDto>(comment))
                : Result<CommentDto>.Failure("Failed to add comment");
        }
    }
}
