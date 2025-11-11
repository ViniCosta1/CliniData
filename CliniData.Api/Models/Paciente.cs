using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using CliniData.Domain.ValueObjects;

namespace CliniData.Api.Models
{
    /// <summary>
    /// Modelo que representa um paciente no sistema
    /// Mapeado para a tabela 'Paciente' do banco de dados
    /// </summary>
    [Table("paciente")]
    public class Paciente
    {
        [Key]
        [Column("idpaciente")]
        public int IdPaciente { get; set; }

        [Required(ErrorMessage = "Nome é obrigatório")]
        [StringLength(100, ErrorMessage = "Nome deve ter no máximo 100 caracteres")]
        [Column("nome")]
        public string Nome { get; set; }

        [Required(ErrorMessage = "Data de nascimento é obrigatória")]
        [Column("datanascimento")]
        private DateTime _dataNascimento;
        public DateTime DataNascimento
        {
            get => _dataNascimento;
            set => _dataNascimento = DateTime.SpecifyKind(value, DateTimeKind.Utc);
        }

        [StringLength(10)]
        [Column("sexo")]
        public string Sexo { get; set; }

        [Required(ErrorMessage = "CPF é obrigatório")]
        [Column("cpf")]
        public string CPF { get; set; }

        [StringLength(20)]
        [Column("telefone")]
        public string Telefone { get; set; }

        [StringLength(100)]
        [Column("email")]
        public string Email { get; set; }

        [StringLength(100)]
        [Column("rua")]
        public string Rua { get; set; }

        [StringLength(10)]
        [Column("numero")]
        public string Numero { get; set; }

        [StringLength(30)]
        [Column("complemento")]
        public string Complemento { get; set; }

        [StringLength(50)]
        [Column("bairro")]
        public string Bairro { get; set; }

        [StringLength(50)]
        [Column("cidade")]
        public string Cidade { get; set; }

        [StringLength(2)]
        [Column("estado")]
        public string Estado { get; set; }

        [StringLength(10)]
        [Column("cep")]
        public string CEP { get; set; }
        public int UserId { get; set; }
    }
}