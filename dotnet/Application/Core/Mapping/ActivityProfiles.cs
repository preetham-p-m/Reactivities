using AutoMapper;
using Domain;

namespace Application.Core.Mapping;

public class ActivityProfiles : Profile
{
    public ActivityProfiles()
    {
        CreateMap<Activity, Activity>();
    }
}
