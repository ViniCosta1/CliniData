using System.ComponentModel.DataAnnotations;

namespace CliniData.Api.DTOs
{
    public class ExameDto
    {
        public int IdExame { get; set; }
        public string TipoExame { get; set; }
        public DateTime DataHora { get; set; }
        public int PacienteId { get; set; }
        public string Instituicao { get; set; }
        public string Resultado { get; set; }
        public string Observacao { get; set; }
        public byte[] DocumentoExame { get; set; }
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
        public string Instituicao { get; set; }

        [StringLength(500)]
        public string Resultado { get; set; }

        [StringLength(500)]
        public string Observacao { get; set; }
        
        public byte[] DocumentoExame { get; set; }
    }
}