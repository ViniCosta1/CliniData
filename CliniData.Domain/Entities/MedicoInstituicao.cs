using System.ComponentModel.DataAnnotations.Schema;

namespace CliniData.Domain.Entities
{
    [Table("medico_instituicao")]
    public class MedicoInstituicao
    {
        public int InstituicaoId { get; set; }
        public int MedicoId { get; set; }

        // Navegação
        public Instituicao Instituicao { get; set; } = null!;
        public Medico Medico { get; set; } = null!;
    }
}
