using System.Linq;
using AutoMapper;
using Domain;

namespace Application.Comments
{
  public class MappingProfile : Profile
  {
    public MappingProfile()
    {
        CreateMap<Comment, CommentDto>()
            .ForMember(d => d.Username, options => options.MapFrom(s => s.Author.UserName))
            .ForMember(d => d.DisplayName, options => options.MapFrom(s => s.Author.DisplayName))
            .ForMember(d => d.Image, options => options.MapFrom(s => s.Author.Photos.FirstOrDefault(x => x.IsMain).Url));
    }
  };
};