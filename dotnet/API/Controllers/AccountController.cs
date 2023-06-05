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
    public async Task<ActionResult<UserDto>> Register(RegisterDto signUpDto)
    {
        if (await UserManager.Users.AnyAsync(e => e.UserName == signUpDto.UserName))
        {
            return BadRequest("Username is not available");
        }
        if (await UserManager.Users.AnyAsync(e => e.Email == signUpDto.Email))
        {
            return BadRequest("Username is not available");
        }

        var user = new User
        {
            DisplayName = signUpDto.DisplayName,
            Email = signUpDto.Email,
            UserName = signUpDto.UserName
        };

        var result = await UserManager.CreateAsync(user, signUpDto.Password);

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
