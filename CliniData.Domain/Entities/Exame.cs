using CliniData.Domain.Abstractions;

namespace CliniData.Domain.Entities
{
    public class Exame : BaseEntity<int>
    {
        public string TipoExame { get; private set; }
        public DateTime DataHora { get; private set; }
        public int PacienteId { get; private set; }
        public int MedicoId { get; private set; }
        public int InstituicaoId { get; private set; }
        public string? Resultado { get; private set; }
        public string? Observacao { get; private set; }

        // 🔒 Construtor protegido para o EF Core
        protected Exame() { }

        private Exame(string tipoExame, DateTime dataHora, int pacienteId, int medicoId, int instituicaoId, string? resultado = null, string? observacao = null)
        {
            TipoExame = tipoExame;
            DataHora = DateTime.SpecifyKind(dataHora, DateTimeKind.Utc);
            PacienteId = pacienteId;
            MedicoId = medicoId;
            InstituicaoId = instituicaoId;
            Resultado = resultado;
            Observacao = observacao;
        }

        // 🏗️ Factory method (criação controlada)
        public static Exame Criar(string tipoExame, DateTime dataHora, int pacienteId, int medicoId, int instituicaoId, string? resultado = null, string? observacao = null)
        {
            return new Exame(tipoExame, dataHora, pacienteId, medicoId, instituicaoId, resultado, observacao);
        }

        // ✏️ Atualização controlada
        public void Atualizar(string tipoExame, DateTime dataHora, int pacienteId, int medicoId, int instituicaoId, string? resultado, string? observacao)
        {
            TipoExame = tipoExame;
            DataHora = DateTime.SpecifyKind(dataHora, DateTimeKind.Utc);
            PacienteId = pacienteId;
            MedicoId = medicoId;
            InstituicaoId = instituicaoId;
            Resultado = resultado;
            Observacao = observacao;
        }
    }
}
