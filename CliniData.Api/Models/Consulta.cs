using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CliniData.Api.Models
{
    [Table("Consulta")]
    public class Consulta
    {
        [Key]
        [Column("IdConsulta")]
        public int IdConsulta { get; set; }

        [Required]
        [Column("DataHora")]
        public DateTime DataHora { get; set; }

        [Required]
        [Column("PacienteId")]
        public int PacienteId { get; set; }

        [Required]
        [Column("MedicoId")]
        public int MedicoId { get; set; }

        [Column("InstituicaoId")]
        public int? InstituicaoId { get; set; }

        [StringLength(500)]
        [Column("Observacao")]
        public string Observacao { get; set; }

        // Relações (opcional, se quiser incluir navigation properties)
        // public Paciente Paciente { get; set; }
        // public Medico Medico { get; set; }
        // public Instituicao Instituicao { get; set; }
    }
}