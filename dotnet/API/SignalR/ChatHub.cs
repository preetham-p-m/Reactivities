using API.Constants;
using Application.Comments;
using MediatR;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR;

public class ChatHub : Hub
{
    public readonly IMediator _mediator;

    public ChatHub(IMediator mediator)
    {
        _mediator = mediator;
    }

    public async Task SendComment(Create.Command command)
    {
        var comment = await _mediator.Send(command);

        await Clients
            .Group(command.ActivityId.ToString())
            .SendAsync(Message.ReceiveComment, comment.Value);
    }

    public override async Task OnConnectedAsync()
    {
        var httpContext = Context.GetHttpContext();
        string activityId = httpContext.Request.Query[Message.ActivityId];
        await Groups.AddToGroupAsync(Context.ConnectionId, activityId);
        var result = await _mediator.Send(new List.Query { ActivityId = Guid.Parse(activityId) });
        await Clients.Caller.SendAsync(Message.LoadComments, result.Value);
    }
}
