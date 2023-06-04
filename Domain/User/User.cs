using Microsoft.AspNetCore.Identity;

namespace Domain;

public class User : IdentityUser
{
    public string DisplayName { get; set; }
    public string Bio { get; set; }
}
