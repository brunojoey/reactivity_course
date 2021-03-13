namespace Infrastructure.Email
{
    public class SendGridSettings
    {
        // both needs to match user-secrets SendGrid:_____
        public string User { get; set; }
        public string Key { get; set; }
    }
}