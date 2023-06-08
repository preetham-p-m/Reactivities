using Application.DTO;
using AutoMapper;
using Domain;

namespace Application.Core.Mapping;

public class ActivityProfiles : Profile
{
    public ActivityProfiles()
    {
        CreateMap<Activity, Activity>();

        CreateMap<Activity, ActivityDto>()
            .ForMember(
                ad => ad.HostUserName,
                m => m.MapFrom(u => u.Attendees.FirstOrDefault(x => x.IsHost).User.UserName)
            );

        CreateMap<ActivityUser, UserForActivityDto>()
            .ForMember(ud => ud.UserName, m => m.MapFrom(aa => aa.User.UserName))
            .ForMember(ud => ud.Bio, m => m.MapFrom(aa => aa.User.Bio))
            .ForMember(ud => ud.DisplayName, m => m.MapFrom(aa => aa.User.DisplayName))
            .ForMember(ud => ud.Image, m => m.MapFrom(aa => aa.User.Bio));
    }
}
