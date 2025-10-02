using System.ComponentModel.DataAnnotations;

namespace CliniData.Api.DTOs
{
    public class HistoricoMedicoDto
    {
        public int IdHistorico { get; set; }
        public int PacienteId { get; set; }
        public DateTime DataRegistro { get; set; }
        public string Diagnostico { get; set; }
        public string Tratamento { get; set; }
        public string Observacao { get; set; }
    }

    public class CriarHistoricoMedicoDto
    {
        [Required]
        public int PacienteId { get; set; }

        public DateTime DataRegistro { get; set; } = DateTime.Now;

        [Required]
        [StringLength(200)]
        public string Diagnostico { get; set; }

        [StringLength(500)]
        public string Tratamento { get; set; }

        [StringLength(500)]
        public string Observacao { get; set; }
    }
}