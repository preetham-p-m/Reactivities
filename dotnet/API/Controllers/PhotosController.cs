using Application.Media.Photos;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class PhotosController : BaseApiController
{
    [HttpPost]
    public async Task<IActionResult> AddAsync([FromForm] Add.Command command)
    {
        return HandleResult(await Mediator.Send(command));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteAsync(string id)
    {
        return HandleResult(await Mediator.Send(new Delete.Command { PublicId = id }));
    }

    [HttpPost("{id}/set-main")]
    public async Task<IActionResult> SetMainAsync(string id)
    {
        return HandleResult(await Mediator.Send(new SetMain.Command { Id = id }));
    }
}
