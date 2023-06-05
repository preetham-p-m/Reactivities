using System.ComponentModel.DataAnnotations;

namespace API.DTO.Auth;

public class RegisterDto
{
    [Required]
    [EmailAddress]
    public string Email { get; set; }

    [Required]
    [MinLength(5)]
    public string UserName { get; set; }

    [Required]
    public string DisplayName { get; set; }

    [Required]
    [RegularExpression(
        "(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{4,8}$",
        ErrorMessage = "Password must be complex"
    )]
    public string Password { get; set; }
}
