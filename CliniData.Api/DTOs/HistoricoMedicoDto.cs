using System.ComponentModel.DataAnnotations;

namespace CliniData.Api.DTOs
{
    public class HistoricoMedicoDto
    {
        public int IdHistorico { get; set; }
        public int MedicoId { get; set; }
        public int PacienteId { get; set; }
        public DateTime DataRegistro { get; set; }
        public string Descricao { get; set; }
    }

    public class CriarHistoricoMedicoDto
    {
        [Required]
        public int PacienteId { get; set; }

        [Required]
        public int MedicoId { get; set; }

        public DateTime DataRegistro { get; set; } = DateTime.Now;

        [StringLength(500)]
        public string Descricao { get; set; }
    }
}