using Application.Core.Constants;
using Application.Followers;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class FollowController : BaseApiController
{
    [HttpPost("{userName}")]
    public async Task<IActionResult> FollowToggleAsync(string userName)
    {
        return HandleResult(
            await Mediator.Send(new FollowToggle.Command { TargetUserName = userName })
        );
    }

    [HttpGet("{userName}")]
    public async Task<IActionResult> GetFollowingAsync(string userName, string predicate)
    {
        return HandleResult(
            await Mediator.Send(new List.Query { UserName = userName, Predicate = predicate })
        );
    }
}
