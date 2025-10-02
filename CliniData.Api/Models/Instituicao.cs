using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CliniData.Api.Models
{
    [Table("Instituicao")]
    public class Instituicao
    {
        [Key]
        [Column("IdInstituicao")]
        public int IdInstituicao { get; set; }

        [Required]
        [StringLength(100)]
        [Column("Nome")]
        public string Nome { get; set; }

        [Required]
        [StringLength(18)]
        [Column("CNPJ")]
        public string CNPJ { get; set; }

        [StringLength(20)]
        [Column("Telefone")]
        public string Telefone { get; set; }

        [StringLength(100)]
        [Column("Rua")]
        public string Rua { get; set; }

        [StringLength(10)]
        [Column("Numero")]
        public string Numero { get; set; }

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