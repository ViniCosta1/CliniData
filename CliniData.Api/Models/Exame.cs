//using System.ComponentModel.DataAnnotations;
//using System.ComponentModel.DataAnnotations.Schema;

//namespace CliniData.Api.Models
//{
//    [Table("Exame")]
//    public class Exame
//    {
//        [Key]
//        [Column("IdExame")]
//        public int IdExame { get; set; }

//        [Required]
//        [Column("TipoExame")]
//        [StringLength(100)]
//        public string TipoExame { get; set; }

//        [Required]
//        [Column("DataHora")]
//        public DateTime DataHora { get; set; }

//        [Required]
//        [Column("PacienteId")]
//        public int PacienteId { get; set; }

//        [Required]
//        [Column("MedicoId")]
//        public int MedicoId { get; set; }

//        [Required]
//        [Column("InstituicaoId")]
//        public int InstituicaoId { get; set; }

//        [Column("Resultado")]
//        [StringLength(500)]
//        public string Resultado { get; set; }

//        [Column("Observacao")]
//        [StringLength(500)]
//        public string Observacao { get; set; }
//    }
//}