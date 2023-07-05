using Application.DTO;
using AutoMapper;

namespace Application.Core.Mapping;

public class UserProfile : Profile
{
    public UserProfile()
    {
        string currentUserName = null;
        CreateMap<Domain.User, UserDto>()
            .ForMember(
                ud => ud.Image,
                m => m.MapFrom(u => u.Photos.FirstOrDefault(p => p.IsMain).Url)
            )
            .ForMember(u => u.FollowersCount, m => m.MapFrom(u => u.Followers.Count))
            .ForMember(u => u.FollowingCount, m => m.MapFrom(u => u.Followings.Count))
            .ForMember(
                d => d.Following,
                o => o.MapFrom(s => s.Followers.Any(x => x.Source.UserName == currentUserName))
            );
    }
}
