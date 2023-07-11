using Microsoft.AspNetCore.Identity;

namespace Domain;

public class User : IdentityUser
{
    public string DisplayName { get; set; }
    public string Bio { get; set; }
    public ICollection<ActivityUser> Activities { get; set; } = new List<ActivityUser>();
    public ICollection<Photo> Photos { get; set; } = new List<Photo>();
    public ICollection<UserFollowing> Followings { get; set; }
    public ICollection<UserFollowing> Followers { get; set; }
    public ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();
}
