using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CliniData.Api.Models
{
    /// <summary>
    /// Modelo que representa um paciente no sistema
    /// Mapeado para a tabela 'Paciente' do banco de dados
    /// </summary>
    [Table("Paciente")]
    public class Paciente
    {
        [Key]
        [Column("IdPaciente")]
        public int IdPaciente { get; set; }

        [Required(ErrorMessage = "Nome é obrigatório")]
        [StringLength(100, ErrorMessage = "Nome deve ter no máximo 100 caracteres")]
        [Column("Nome")]
        public string Nome { get; set; }

        [Required(ErrorMessage = "Data de nascimento é obrigatória")]
        [Column("DataNascimento")]
        public DateTime DataNascimento { get; set; }

        [StringLength(10)]
        [Column("Sexo")]
        public string Sexo { get; set; }

        [Required(ErrorMessage = "CPF é obrigatório")]
        [StringLength(14)]
        [Column("CPF")]
        public string CPF { get; set; }

        [StringLength(20)]
        [Column("Telefone")]
        public string Telefone { get; set; }

        [StringLength(100)]
        [EmailAddress(ErrorMessage = "Email deve ter formato válido")]
        [Column("Email")]
        public string Email { get; set; }

        [StringLength(100)]
        [Column("Rua")]
        public string Rua { get; set; }

        [StringLength(10)]
        [Column("Numero")]
        public string Numero { get; set; }

        [StringLength(30)]
        [Column("Complemento")]
        public string Complemento { get; set; }

        [StringLength(50)]
        [Column("Bairro")]
        public string Bairro { get; set; }

        [StringLength(50)]
        [Column("Cidade")]
        public string Cidade { get; set; }

        [StringLength(2)]
        [Column("Estado")]
        public string Estado { get; set; }

        [StringLength(10)]
        [Column("CEP")]
        public string CEP { get; set; }
    }
}