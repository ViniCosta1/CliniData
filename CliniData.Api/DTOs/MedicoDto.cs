using System.ComponentModel.DataAnnotations;

namespace CliniData.Api.DTOs
{
    public class MedicoDto
    {
        public int IdMedico { get; set; }
        public string Nome { get; set; }
        public string CRM { get; set; }
        public string Especialidade { get; set; }
        public string Telefone { get; set; }
        public string Email { get; set; }
    }

    public class CriarMedicoDto
    {
        [Required(ErrorMessage = "Nome é obrigatório")]
        [StringLength(100)]
        public string Nome { get; set; }

        [Required(ErrorMessage = "CRM é obrigatório")]
        [StringLength(20)]
        public string CRM { get; set; }

        [Required(ErrorMessage = "Especialidade é obrigatória")]
        [StringLength(50)]
        public string Especialidade { get; set; }

        [StringLength(20)]
        public string Telefone { get; set; }

        [StringLength(100)]
        [EmailAddress]
        public string Email { get; set; }
    }
}