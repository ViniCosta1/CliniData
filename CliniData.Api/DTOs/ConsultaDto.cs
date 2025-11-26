using CliniData.Domain.Entities;
using System.ComponentModel.DataAnnotations;

namespace CliniData.Api.DTOs;

public class ConsultaDto
{
    public int IdConsulta { get; set; }
    public DateTime DataHora { get; set; }
    public int PacienteId { get; set; }
    public int MedicoId { get; set; }
    public int? InstituicaoId { get; set; }
    public string Observacao { get; set; }
    public PacienteDto Paciente { get; set; }
    public MedicoDto Medico { get; set; }
    public InstituicaoDto Instituicao { get; set; }
}

public class CriarConsultaDto
{
    [Required]
    public DateTime DataHora { get; set; }

    [Required]
    public int PacienteId { get; set; }


    public int? InstituicaoId { get; set; }

    [StringLength(500)]
    public string Observacao { get; set; }
}

public class EditarConsultaDto
{

    [StringLength(500)]
    public string Observacao { get; set; }
}

