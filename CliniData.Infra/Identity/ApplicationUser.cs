using Microsoft.AspNetCore.Identity;

namespace CliniData.Infra.Identity;

// Usuário do sistema (login). Chave inteira para alinhar com seu banco.
public class ApplicationUser : IdentityUser<int>
{
    // Relacionamentos com entidades de domínio (opcionais)
    public int? MedicoId { get; set; }
    public int? PacienteId { get; set; }

    // Se quiser, adicione campos de conta (mas evite campos de domínio aqui)
}