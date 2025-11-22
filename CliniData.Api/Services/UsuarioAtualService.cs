using Microsoft.AspNetCore.Http;
using System.Security.Claims;

namespace CliniData.Api.Services
{
    public class UsuarioAtualService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public UsuarioAtualService(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public string? ObterUsuarioId()
        {
            var user = _httpContextAccessor.HttpContext?.User;
            if (user == null)
                return null;

            // Identity normal (NameIdentifier)
            var id = user.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!string.IsNullOrEmpty(id))
                return id;

            // Identity com MapIdentityApi usa "sub"
            id = user.FindFirstValue("sub");
            if (!string.IsNullOrEmpty(id))
                return id;

            // fallback usado às vezes
            id = user.FindFirstValue("id");
            if (!string.IsNullOrEmpty(id))
                return id;

            // nada encontrado
            return null;
        }
    }
}
