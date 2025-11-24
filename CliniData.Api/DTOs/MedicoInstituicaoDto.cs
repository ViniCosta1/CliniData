using System.ComponentModel.DataAnnotations;

public class VincularMedicoInstituicaoDto
{
    [Required]
    public int MedicoId { get; set; }
}

public class MedicoEmInstituicaoDto
{
    public int IdMedico { get; set; }
    public string Nome { get; set; } = null!;
    public string CRM { get; set; } = null!;
}

public class InstituicaoDeMedicoDto
{
    public int IdInstituicao { get; set; }
    public string Nome { get; set; } = null!;
}
