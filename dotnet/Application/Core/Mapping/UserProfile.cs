using Application.DTO;
using AutoMapper;

namespace Application.Core.Mapping;

public class UserProfile : Profile
{
    public UserProfile()
    {
        CreateMap<Domain.User, UserDto>()
            .ForMember(
                ud => ud.Image,
                m => m.MapFrom(u => u.Photos.FirstOrDefault(p => p.IsMain).Url)
            );
    }
}
