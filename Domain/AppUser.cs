using System.Collections.Generic;
using System.Collections.ObjectModel;
using Microsoft.AspNetCore.Identity;

namespace Domain
{
  public class AppUser : IdentityUser
  {
    public AppUser()
    {
      // When we create a new instance, we have an initailized collection of Photos
      // Will prevent a null reference exception when going into ExternalLogin.CS line of 61
      Photos = new Collection<Photo>();
    }

    // Name of the user which will be displayed
    public string DisplayName { get; set; }
    public string Bio { get; set; }
    public virtual ICollection<UserActivity> UserActivities { get; set; }
    public virtual ICollection<Photo> Photos { get; set; }
    public virtual ICollection<UserFollowing> Followings { get; set; }
    public virtual ICollection<UserFollowing> Followers { get; set; }
    public virtual ICollection<RefreshToken> RefreshTokens { get; set; }
  }
};