using Application.Core.Pagination;

namespace Application.Activities;

public class ActivityQuery : PagingQuery
{
    public bool IsGoing { get; set; }
    public bool IsHost { get; set; }
    public DateTime StartDate { get; set; } = DateTime.UtcNow;
}
