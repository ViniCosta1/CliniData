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
        public ICollection<Instituicao> Instituicoes { get; private set; } = new List<Instituicao>();

        public int UserId { get; private set; }



        protected Medico() { } // EF Core

        private Medico(string nome, CRM crm, int especialidadeMedicaId, string telefone, Email email)
        {
            Nome = nome;
            CRM = crm;
            EspecialidadeMedicaId = especialidadeMedicaId;
            Telefone = telefone;
            Email = email;
        }

        public static Medico Criar(string nome, CRM crm, int especialidadeMedicaId, string telefone, Email email)
        {
            return new Medico(nome, crm, especialidadeMedicaId, telefone, email);
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
