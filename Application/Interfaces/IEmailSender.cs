using System.Threading.Tasks;

namespace Application.Interfaces
{
    public interface IEmailSender
    {
         Task SendEmailAsync(string userEmail, string emailSubjeect, string message);
    }
}