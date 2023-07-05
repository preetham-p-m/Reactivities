using System.Reflection;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Persistence.EntityBuilder;
using Persistence.EntityConfiguration;

namespace Persistence;

public class DataContext : IdentityDbContext<User>
{
    public DataContext(DbContextOptions options)
        : base(options) { }

    public DbSet<Activity> Activities { get; set; }
    public DbSet<ActivityUser> ActivityAttendees { get; set; }
    public DbSet<Photo> Photos { get; set; }
    public DbSet<Comment> Comments { get; set; }
    public DbSet<UserFollowing> UserFollowings { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        // Apply all configuration file which are extending IEntityTypeConfiguration<EntityName>
        builder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());

        base.OnModelCreating(builder);
    }
}
