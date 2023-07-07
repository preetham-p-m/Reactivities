using Microsoft.EntityFrameworkCore;

namespace Application.Core.Pagination;

public class PagedList<T> : List<T>
{
    public int CurrentPage { get; set; }
    public int TotolPages { get; set; }
    public int PageSize { get; set; }
    public int TotalCount { get; set; }

    public PagedList(IEnumerable<T> items, int pageNumber, int pageSizes, int count)
    {
        CurrentPage = pageNumber;
        TotolPages = (int)Math.Ceiling(count / (double)pageSizes);
        PageSize = pageSizes;
        TotalCount = count;
        AddRange(items);
    }

    public static async Task<PagedList<T>> CreateAsync(
        IQueryable<T> source,
        int pageNumber,
        int pageSize
    )
    {
        var count = await source.CountAsync();
        var items = await source.Skip(pageSize * (pageNumber - 1)).Take(pageSize).ToListAsync();
        return new PagedList<T>(items, pageNumber, pageSize, count);
    }
}
