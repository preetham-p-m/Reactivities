using System.Security.Claims;
using API.Constants;
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
    public async Task<ActionResult<AuthUserDto>> Login(LoginDto loginDto)
    {
        var user = await UserManager.Users
            .Include(u => u.Photos)
            .FirstOrDefaultAsync(u => u.Email == loginDto.Email);

        if (user == null)
            return Unauthorized();

        var isRightPassword = await UserManager.CheckPasswordAsync(user, loginDto.Password);

        if (isRightPassword)
        {
            await SetRefreshToken(user);
            return CreateUserDtoObject(user);
        }

        return Unauthorized();
    }

    [AllowAnonymous]
    [HttpPost("register")]
    public async Task<ActionResult<AuthUserDto>> Register(RegisterDto registerDto)
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
            await SetRefreshToken(user);
            return CreateUserDtoObject(user);
        }

        return BadRequest(result.Errors);
    }

    [HttpGet]
    public async Task<ActionResult<AuthUserDto>> GetCurrentUser()
    {
        var user = await UserManager.Users
            .Include(u => u.Photos)
            .FirstOrDefaultAsync(u => u.Email == User.FindFirstValue(ClaimTypes.Email));

        await SetRefreshToken(user);
        return CreateUserDtoObject(user);
    }

    [Authorize]
    [HttpPost("refreshToken")]
    public async Task<ActionResult<AuthUserDto>> RefreshToken()
    {
        var refreshToken = Request.Cookies[Auth.RefreshToken];
        var user = await UserManager.Users
            .Include(u => u.Photos)
            .Include(u => u.RefreshTokens)
            .FirstOrDefaultAsync(u => u.UserName == User.FindFirstValue(ClaimTypes.Name));

        if (user == null)
            return Unauthorized();

        var oldToken = user.RefreshTokens.SingleOrDefault(z => z.Token == refreshToken);

        if (oldToken != null && !oldToken.IsActive)
            return Unauthorized();

        return CreateUserDtoObject(user);
    }

    private async Task SetRefreshToken(User user)
    {
        var refreshToken = JwtTokenService.GenerateRefreshToken();

        user.RefreshTokens.Add(refreshToken);
        await UserManager.UpdateAsync(user);

        var cookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Expires = DateTime.UtcNow.AddDays(7),
            Secure = true
        };

        Response.Cookies.Append(Auth.RefreshToken, refreshToken.Token, cookieOptions);
    }

    private AuthUserDto CreateUserDtoObject(User user)
    {
        return new AuthUserDto
        {
            DisplayName = user.UserName,
            Image = user?.Photos?.FirstOrDefault(p => p.IsMain)?.Url,
            Token = JwtTokenService.CreateToken(user),
            UserName = user.UserName
        };
    }
}
