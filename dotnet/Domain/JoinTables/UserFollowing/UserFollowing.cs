namespace Domain;

public class UserFollowing
{
    public string SourceUserId { get; set; }
    public User Source { get; set; }
    public string TargetUserId { get; set; }
    public User Target { get; set; }
}
