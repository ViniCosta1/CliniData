using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CliniData.Api.Models
{
    [Table("Medico")]
    public class Medico
    {
        [Key]
        [Column("IdMedico")]
        public int IdMedico { get; set; }

        [Required(ErrorMessage = "Nome é obrigatório")]
        [StringLength(100)]
        [Column("Nome")]
        public string Nome { get; set; }

        [Required(ErrorMessage = "CRM é obrigatório")]
        [StringLength(20)]
        [Column("CRM")]
        public string CRM { get; set; }

        [Required(ErrorMessage = "Especialidade é obrigatória")]
        [StringLength(50)]
        [Column("Especialidade")]
        public string Especialidade { get; set; }

        [StringLength(20)]
        [Column("Telefone")]
        public string Telefone { get; set; }

        [StringLength(100)]
        [EmailAddress]
        [Column("Email")]
        public string Email { get; set; }
    }
}