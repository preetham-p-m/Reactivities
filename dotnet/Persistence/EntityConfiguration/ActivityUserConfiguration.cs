using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Persistence.EntityBuilder;

public class ActivityUserConfiguration : IEntityTypeConfiguration<ActivityUser>
{
    public ActivityUserConfiguration() { }

    public void Configure(EntityTypeBuilder<ActivityUser> builder)
    {
        builder.HasKey(aa => new { aa.UserId, aa.ActivityId });

        builder.HasOne(u => u.User).WithMany(a => a.Activities).HasForeignKey(aa => aa.UserId);

        builder
            .HasOne(a => a.Activity)
            .WithMany(u => u.Attendees)
            .HasForeignKey(aa => aa.ActivityId);
    }
}
