using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Persistence.EntityConfiguration;

public class UserFollowingConfiguration : IEntityTypeConfiguration<UserFollowing>
{
    public void Configure(EntityTypeBuilder<UserFollowing> builder)
    {
        builder.HasKey(uf => new { uf.SourceUserId, uf.TargetUserId });

        builder
            .HasOne(uf => uf.Source)
            .WithMany(uf => uf.Followings)
            .HasForeignKey(uf => uf.SourceUserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder
            .HasOne(uf => uf.Target)
            .WithMany(u => u.Followers)
            .HasForeignKey(uf => uf.TargetUserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
