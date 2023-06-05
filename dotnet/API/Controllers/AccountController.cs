using System.Security.Claims;
using API.DTO.Auth;
using API.DTO.User;
using API.Services;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AccountController : ControllerBase
{
    public UserManager<User> UserManager { get; }
    public JwtTokenService JwtTokenService { get; }

    public AccountController(UserManager<User> userManager, JwtTokenService jwtTokenService)
    {
        JwtTokenService = jwtTokenService;
        UserManager = userManager;
    }

    [AllowAnonymous]
    [HttpPost("login")]
    public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
    {
        var user = await UserManager.FindByEmailAsync(loginDto.Email);

        if (user == null)
            return Unauthorized();

        var isRightPassword = await UserManager.CheckPasswordAsync(user, loginDto.Password);

        if (isRightPassword)
        {
            return CreateUserDtoObject(user);
        }

        return Unauthorized();
    }

    [AllowAnonymous]
    [HttpPost("register")]
    public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
    {
        if (await UserManager.Users.AnyAsync(e => e.UserName == registerDto.UserName))
        {
            ModelState.AddModelError("UserName", "UserName is not available");
        }
        if (await UserManager.Users.AnyAsync(e => e.Email == registerDto.Email))
        {
            ModelState.AddModelError("email", "Email already exists");
        }

        if (ModelState.Count != 0)
        {
            return ValidationProblem(ModelState);
        }

        var user = new User
        {
            DisplayName = registerDto.DisplayName,
            Email = registerDto.Email,
            UserName = registerDto.UserName
        };

        var result = await UserManager.CreateAsync(user, registerDto.Password);

        if (result.Succeeded)
        {
            return CreateUserDtoObject(user);
        }

        return BadRequest(result.Errors);
    }

    [HttpGet]
    public async Task<ActionResult<UserDto>> GetCurrentUser()
    {
        var user = await UserManager.FindByEmailAsync(User.FindFirstValue(ClaimTypes.Email));
        return CreateUserDtoObject(user);
    }

    private UserDto CreateUserDtoObject(User user)
    {
        return new UserDto
        {
            DisplayName = user.UserName,
            Image = null,
            Token = JwtTokenService.CreateToken(user),
            UserName = user.UserName
        };
    }
}
