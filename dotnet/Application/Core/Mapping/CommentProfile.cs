using Application.DTO;
using AutoMapper;
using Domain;

namespace Application.Core.Mapping;

public class CommentProfile : Profile
{
    public CommentProfile()
    {
        CreateMap<Comment, CommentDto>()
            .ForMember(cd => cd.DisplayName, m => m.MapFrom(c => c.Author.DisplayName))
            .ForMember(
                cd => cd.Image,
                m => m.MapFrom(c => c.Author.Photos.FirstOrDefault(p => p.IsMain).Url)
            )
            .ForMember(cd => cd.UserName, m => m.MapFrom(c => c.Author.UserName));
    }
}
