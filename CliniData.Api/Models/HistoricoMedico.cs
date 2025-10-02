using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CliniData.Api.Models
{
    [Table("HistoricoMedico")]
    public class HistoricoMedico
    {
        [Key]
        [Column("IdHistorico")]
        public int IdHistorico { get; set; }

        [Required]
        [Column("PacienteId")]
        public int PacienteId { get; set; }

        [Column("DataRegistro")]
        public DateTime DataRegistro { get; set; }

        [Required]
        [StringLength(200)]
        [Column("Diagnostico")]
        public string Diagnostico { get; set; }

        [StringLength(500)]
        [Column("Tratamento")]
        public string Tratamento { get; set; }

        [StringLength(500)]
        [Column("Observacao")]
        public string Observacao { get; set; }
    }
}