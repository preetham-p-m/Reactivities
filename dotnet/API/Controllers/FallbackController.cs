using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class FallbackController : Controller
{
    [AllowAnonymous]
    public IActionResult Index()
    {
        return PhysicalFile(
            Path.Combine(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "index.html")),
            "text/HTML"
        );
    }
}
