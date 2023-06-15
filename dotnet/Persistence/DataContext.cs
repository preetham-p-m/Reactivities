using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace Persistence;

public class DataContext : IdentityDbContext<User>
{
    public DataContext(DbContextOptions options)
        : base(options) { }

    public DbSet<Activity> Activities { get; set; }
    public DbSet<ActivityUser> ActivityAttendees { get; set; }
    public DbSet<Photo> Photos { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<ActivityUser>(x => x.HasKey(aa => new { aa.UserId, aa.ActivityId }));

        builder
            .Entity<ActivityUser>()
            .HasOne(u => u.User)
            .WithMany(a => a.Activities)
            .HasForeignKey(aa => aa.UserId);

        builder
            .Entity<ActivityUser>()
            .HasOne(a => a.Activity)
            .WithMany(u => u.Attendees)
            .HasForeignKey(aa => aa.ActivityId);
    }
}
