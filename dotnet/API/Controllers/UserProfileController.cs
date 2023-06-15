using Application.User;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class UserProfileController : BaseApiController
{
    [HttpGet("{username}")]
    public async Task<IActionResult> GetUserAsync(string username)
    {
        return HandleResult(await Mediator.Send(new Details.Query { UserName = username }));
    }
}
