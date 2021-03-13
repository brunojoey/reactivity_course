using System.Linq;
using System.Text.Json.Serialization;
using Application.Interfaces;
using Domain;

namespace Application.User
{
    public class User
    {
        public User(AppUser user, IJwtGenerator jwtGenerator, string refreshToken)
        {
            DisplayName = user.DisplayName;
            Token = jwtGenerator.CreateToken(user);
            Username = user.UserName;
            Image = user.Photos.FirstOrDefault(x => x.IsMain)?.Url;
            RefreshToken = refreshToken;
        }

        // Properties we want to return when a user signs in
        public string DisplayName { get; set; }
        public string Token { get; set; }
        public string Username { get; set; }
        public string Image { get; set; }

        // When we return the user object, the RefreshToken will be ignored and eventually return as a cookie
        [JsonIgnore]
        public string RefreshToken { get; set; }
    }
}