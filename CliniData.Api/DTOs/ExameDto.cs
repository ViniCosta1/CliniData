using CliniData.Domain.Entities;
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
        public string Extensao { get; set; }

        public static ExameDto FromEntity(Exame e)
        {
            return new ExameDto
            {
                IdExame = e.Id,
                TipoExame = e.TipoExame,
                DataHora = e.DataHora,
                PacienteId = e.PacienteId,
                Instituicao = e.Instituicao,
                Resultado = e.Resultado,
                Observacao = e.Observacao,
                DocumentoExame = e.DocumentoExame,
                Extensao = e.Extensao
            };
        }
    }
    public class CriarExameDto
    {
        [Required]
        [StringLength(100)]
        public string TipoExame { get; set; }

        [Required]
        public DateTime DataHora { get; set; }

        [Required]
        public string Instituicao { get; set; }

        [StringLength(500)]
        public string Resultado { get; set; }

        [StringLength(500)]
        public string Observacao { get; set; }
    }

    public class CriarExameFormDto
    {
        [Required]
        public string TipoExame { get; set; }

        [Required]
        public DateTime DataHora { get; set; }

        [Required]
        public string Instituicao { get; set; }

        public string? Resultado { get; set; }
        public string? Observacao { get; set; }

        // Agora correto
        public IFormFile? DocumentoExame { get; set; }
    }
}
