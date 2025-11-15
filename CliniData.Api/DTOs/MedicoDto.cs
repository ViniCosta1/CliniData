using System.ComponentModel.DataAnnotations;

public class MedicoDto
{
    public int IdMedico { get; set; }
    public string Nome { get; set; }
    public string CRM { get; set; }
    public int EspecialidadeMedicaId { get; set; } // 🔹 agora é FK
    public string Telefone { get; set; }
    public string Email { get; set; }
    public int InstituicaoId { get; set; }
}

public class CriarMedicoDto
{
    [Required]
    public string Nome { get; set; }

    [Required]
    public string Passowrd { get; set; }

    [Required]
    public string CRM { get; set; }

    [Required]
    public int EspecialidadeMedicaId { get; set; } // 🔹 id da especialidade

    public string Telefone { get; set; }
    public string Email { get; set; }

    [Required]
    public int InstituicaoId { get; set; }
}
