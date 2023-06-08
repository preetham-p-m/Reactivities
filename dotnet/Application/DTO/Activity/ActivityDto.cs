using Domain;

namespace Application.DTO;

public class ActivityDto
{
    public Guid Id { get; set; }
    public string Title { get; set; }
    public DateTime Date { get; set; }
    public string Description { get; set; }
    public string Category { get; set; }
    public string City { get; set; }
    public string Venue { get; set; }
    public bool IsCancelled { get; set; }
    public string HostUserName { get; set; }
    public ICollection<UserForActivityDto> Attendees { get; set; }
}
