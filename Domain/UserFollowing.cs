namespace Domain
{
    public class UserFollowing
    {
        public string ObserverId { get; set; }
        public virtual AppUser Observer { get; set; }
        // virtual is because they will be navigation properties
        public string TargetId { get; set; }
        public virtual AppUser Target { get; set; }
    }
}