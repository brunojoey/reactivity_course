using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;

namespace Domain
{
  public class AppUser : IdentityUser
  {
    // Name of the user which will be displayed
    public string DisplayName { get; set; }
    public string Bio { get; set; }
    public virtual ICollection<UserActivity> UserActivities { get; set; }
    public virtual ICollection<Photo> Photos { get; set; }
  }
};