using System.Net;
using System.Net.Mail;

namespace BloggingApp.API.Services
{
    public class EmailService : IEmailService
    {
        public void SendEmail(string toEmail, string subject, string body)
        {
            var smtpClient = new SmtpClient
            {
                Host = "smtp.gmail.com",
                Port = 587,
                EnableSsl = true,
                UseDefaultCredentials = false, 
                Credentials = new NetworkCredential(
                    "amolyenge.sde2025@gmail.com",
                    "epoawxmrxqewmmqh"
                )
            };

            var mail = new MailMessage
            {
                From = new MailAddress("amolyenge.sde2025@gmail.com"),
                Subject = subject,
                Body = body,
                IsBodyHtml = true
            };

            mail.To.Add(toEmail);

            smtpClient.Send(mail);
        }
    }
}
