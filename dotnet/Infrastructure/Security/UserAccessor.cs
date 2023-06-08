using System.Security.Claims;
using Application.Interface;
using Microsoft.AspNetCore.Http;

namespace Infrastructure.Security;

public class UserAccessor : IUserAccessor
{
    public IHttpContextAccessor HttpContextAccessor { get; }

    public UserAccessor(IHttpContextAccessor httpContextAccessor)
    {
        HttpContextAccessor = httpContextAccessor;
    }

    public string GetUserName()
    {
        return HttpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);
    }
}
