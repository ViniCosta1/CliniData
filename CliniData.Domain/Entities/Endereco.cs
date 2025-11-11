using CliniData.Domain.Abstractions;
using CliniData.Domain.Entities;

public class Endereco : BaseEntity<int>
{
    public string Rua { get; set; } = null!;
    public string Numero { get; set; } = null!;
    public string? Complemento { get; set; }
    public string Bairro { get; set; } = null!;
    public string Cidade { get; set; } = null!;
    public string UF { get; set; } = null!;
    public string CEP { get; set; } = null!;

    // FK e navegação
    public int PacienteId { get; set; }
    public Paciente Paciente { get; set; } = null!;
}
