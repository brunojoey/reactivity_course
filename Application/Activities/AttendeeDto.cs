namespace Application.Activities
{
    public class AttendeeDto
    {
        // want to return the properties of the user object that is part of the related data
        public string Username { get; set; }
        public string DisplayName { get; set; }
        public string Image { get; set; }
        public bool IsHost { get; set; }
        public bool Following { get; set; }
    }
}