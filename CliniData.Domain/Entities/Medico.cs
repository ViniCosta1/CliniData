using CliniData.Domain.Abstractions;
using CliniData.Domain.ValueObjects;
using System.ComponentModel.DataAnnotations.Schema;

namespace CliniData.Domain.Entities
{
    [Table("medico")]
    public class Medico : BaseEntity<int>
    {
        public string Nome { get; private set; }
        public CRM CRM { get; private set; }
        public int EspecialidadeMedicaId { get; private set; } // 🔹 FK
        public EspecialidadeMedica EspecialidadeMedica { get; private set; } // 🔹 Navegação
        public string Telefone { get; private set; }
        public Email Email { get; private set; }
        public int InstituicaoId { get; private set; }
        public int UserId { get; private set; }

        // Navegação
        public Instituicao? Instituicao { get; private set; }

        protected Medico() { } // EF Core

        private Medico(string nome, CRM crm, int especialidadeMedicaId, string telefone, Email email, int instituicaoId)
        {
            Nome = nome;
            CRM = crm;
            EspecialidadeMedicaId = especialidadeMedicaId;
            Telefone = telefone;
            Email = email;
            InstituicaoId = instituicaoId;
        }

        public static Medico Criar(string nome, CRM crm, int especialidadeMedicaId, string telefone, Email email, int instituicaoId)
        {
            return new Medico(nome, crm, especialidadeMedicaId, telefone, email, instituicaoId);
        }

        public void Atualizar(string nome, CRM crm, int especialidadeMedicaId, string telefone, Email email)
        {
            Nome = nome;
            CRM = crm;
            EspecialidadeMedicaId = especialidadeMedicaId;
            Telefone = telefone;
            Email = email;
        }
    }
}
