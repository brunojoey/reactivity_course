using System.Linq;
using AutoMapper;
using Domain;

namespace Application.Activities
{
  public class MappingProfile : Profile
  {
    public MappingProfile()
    {
        // where we create our maps
        CreateMap<Activity, ActivityDto>(); // Activity to Activity DTO 
        CreateMap<UserActivity, AttendeeDto>() // UserActivity to Attendee DTO
            .ForMember(d => d.Username, options => options.MapFrom(src => src.AppUser.UserName))
            .ForMember(d => d.DisplayName, options => options.MapFrom(src => src.AppUser.DisplayName))
            .ForMember(d => d.Image, options => options.MapFrom(src => src.AppUser.Photos.FirstOrDefault(x => x.IsMain).Url))
            .ForMember(d => d.Following, options => options.MapFrom<FollowingResolver>()); // will set following to true if the current user is following someone in the list
    }
  }
}