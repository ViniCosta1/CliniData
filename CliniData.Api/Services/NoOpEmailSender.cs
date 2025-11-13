using Microsoft.AspNetCore.Identity;
using System.Threading.Tasks;
using CliniData.Infra.Identity;

namespace CliniData.Api.Services
{
    // Implementação fake de envio de e-mails para o Identity
    public class NoOpEmailSender : IEmailSender<ApplicationUser>
    {
        public Task SendConfirmationLinkAsync(ApplicationUser user, string email, string confirmationLink)
            => Task.CompletedTask;

        public Task SendPasswordResetLinkAsync(ApplicationUser user, string email, string resetLink)
            => Task.CompletedTask;

        public Task SendPasswordResetCodeAsync(ApplicationUser user, string email, string resetCode)
            => Task.CompletedTask;
    }
}
