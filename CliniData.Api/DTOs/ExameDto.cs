using System.ComponentModel.DataAnnotations;

namespace CliniData.Api.DTOs
{
    public class ExameDto
    {
        public int IdExame { get; set; }
        public string TipoExame { get; set; }
        public DateTime DataHora { get; set; }
        public int PacienteId { get; set; }
        public int MedicoId { get; set; }
        public int InstituicaoId { get; set; }
        public string Resultado { get; set; }
        public string Observacao { get; set; }
    }

    public class CriarExameDto
    {
        [Required]
        [StringLength(100)]
        public string TipoExame { get; set; }

        [Required]
        public DateTime DataHora { get; set; }

        [Required]
        public int PacienteId { get; set; }

        [Required]
        public int MedicoId { get; set; }

        [Required]
        public int InstituicaoId { get; set; }

        [StringLength(500)]
        public string Resultado { get; set; }

        [StringLength(500)]
        public string Observacao { get; set; }
    }
}