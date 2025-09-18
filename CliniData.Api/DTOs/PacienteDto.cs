using System.ComponentModel.DataAnnotations;

namespace CliniData.Api.DTOs
{
    /// <summary>
    /// DTO para retornar dados do paciente
    /// </summary>
    public class PacienteDto
    {
        public int IdPaciente { get; set; }
        public string Nome { get; set; }
        public DateTime DataNascimento { get; set; }
        public string Sexo { get; set; }
        public string CPF { get; set; }
        public string Telefone { get; set; }
        public string Email { get; set; }
        public string Rua { get; set; }
        public string Numero { get; set; }
        public string Complemento { get; set; }
        public string Bairro { get; set; }
        public string Cidade { get; set; }
        public string Estado { get; set; }
        public string CEP { get; set; }
    }

    /// <summary>
    /// DTO para criar/atualizar paciente
    /// </summary>
    public class CriarPacienteDto
    {
        [Required(ErrorMessage = "Nome é obrigatório")]
        [StringLength(100, ErrorMessage = "Nome deve ter no máximo 100 caracteres")]
        public string Nome { get; set; }

        [Required(ErrorMessage = "Data de nascimento é obrigatória")]
        public DateTime DataNascimento { get; set; }

        [StringLength(10)]
        public string Sexo { get; set; }

        [Required(ErrorMessage = "CPF é obrigatório")]
        [StringLength(14)]
        public string CPF { get; set; }

        [StringLength(20)]
        public string Telefone { get; set; }

        [StringLength(100)]
        [EmailAddress(ErrorMessage = "Email deve ter formato válido")]
        public string Email { get; set; }

        [StringLength(100)]
        public string Rua { get; set; }

        [StringLength(10)]
        public string Numero { get; set; }

        [StringLength(30)]
        public string Complemento { get; set; }

        [StringLength(50)]
        public string Bairro { get; set; }

        [StringLength(50)]
        public string Cidade { get; set; }

        [StringLength(2)]
        public string Estado { get; set; }

        [StringLength(10)]
        public string CEP { get; set; }
    }
}