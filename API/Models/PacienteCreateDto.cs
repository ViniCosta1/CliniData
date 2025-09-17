using System;
using System.ComponentModel.DataAnnotations;

namespace CliniData.API.Models
{
    public class PacienteCreateDto
    {
        [Required(ErrorMessage = "Nome é obrigatório.")]
        [StringLength(100, ErrorMessage = "Nome deve ter até 100 caracteres.")]
        public string Nome { get; set; }

        [Required(ErrorMessage = "Data de nascimento é obrigatória.")]
        public DateTime DataNascimento { get; set; }

        [Required(ErrorMessage = "Sexo é obrigatório.")]
        [StringLength(1, ErrorMessage = "Sexo deve ser 'M' ou 'F'.")]
        public string Sexo { get; set; }

        [Required(ErrorMessage = "CPF é obrigatório.")]
        [StringLength(14, ErrorMessage = "CPF deve ter até 14 caracteres.")]
        public string CPF { get; set; }

        [Required(ErrorMessage = "Telefone é obrigatório.")]
        [StringLength(20, ErrorMessage = "Telefone deve ter até 20 caracteres.")]
        public string Telefone { get; set; }

        [Required(ErrorMessage = "Email é obrigatório.")]
        [EmailAddress(ErrorMessage = "Email inválido.")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Rua é obrigatória.")]
        public string Rua { get; set; }

        [Required(ErrorMessage = "Número é obrigatório.")]
        public string Numero { get; set; }

        public string Complemento { get; set; }

        [Required(ErrorMessage = "Bairro é obrigatório.")]
        public string Bairro { get; set; }

        [Required(ErrorMessage = "Cidade é obrigatória.")]
        public string Cidade { get; set; }

        [Required(ErrorMessage = "Estado é obrigatório.")]
        [StringLength(2, ErrorMessage = "Estado deve ter 2 letras.")]
        public string Estado { get; set; }

        [Required(ErrorMessage = "CEP é obrigatório.")]
        [StringLength(10, ErrorMessage = "CEP deve ter até 10 caracteres.")]
        public string CEP { get; set; }
    }
}