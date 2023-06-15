using Domain;

namespace Application.DTO;

public class UserDto
{
    public string UserName { get; set; }
    public string DisplayName { get; set; }
    public string Bio { get; set; }
    public string Image { get; set; }
    public ICollection<Photo> Photos { get; set; }
}
