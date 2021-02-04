using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;

namespace Domain
{
    public class AppUser : IdentityUser
    {
        // Name of the user which will be displayed
        public string DisplayName { get; set; }
        public virtual ICollection<UserActivity> UserActivities { get; set; }
    }
};