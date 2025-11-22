using Microsoft.AspNetCore.Http;
using System.Security.Claims;

namespace CliniData.Api.Services
{
    public class UsuarioAtualService : IUsuarioAtualService
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

            var id = user.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!string.IsNullOrEmpty(id))
                return id;

            id = user.FindFirstValue("sub");
            if (!string.IsNullOrEmpty(id))
                return id;

            id = user.FindFirstValue("id");
            if (!string.IsNullOrEmpty(id))
                return id;

            return null;
        }
    }
}
