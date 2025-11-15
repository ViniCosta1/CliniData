using System.ComponentModel.DataAnnotations;

namespace CliniData.Api.DTOs
{
    public class InstituicaoDto
    {
        public int IdInstituicao { get; set; }
        public string Nome { get; set; }
        public string CNPJ { get; set; }
        public string Telefone { get; set; }
        public string Rua { get; set; }
        public string Numero { get; set; }
        public string Bairro { get; set; }
        public string Cidade { get; set; }
        public string Estado { get; set; }
        public string CEP { get; set; }
    }

    public class CriarInstituicaoDto
    {
        [Required]
        [StringLength(100)]
        public string Nome { get; set; }
        [Required, StringLength(100)]
        public string Password { get; set; }

        [Required]
        [StringLength(18)]
        public string CNPJ { get; set; }

        [StringLength(20)]
        public string Telefone { get; set; }

        [StringLength(100)]
        public string Rua { get; set; }

        [StringLength(10)]
        public string Numero { get; set; }

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