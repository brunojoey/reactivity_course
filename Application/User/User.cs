namespace Application.User
{
    public class User
    {
        // Properties we want to return when a user signs in
        public string DisplayName { get; set; }
        public string Token { get; set; }
        public string Username { get; set; }
        public string Image { get; set; }
    }
}