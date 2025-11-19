using CliniData.Domain.Abstractions;

namespace CliniData.Domain.Entities
{
    public class Exame : BaseEntity<int>
    {
        public string TipoExame { get; private set; }
        public DateTime DataHora { get; private set; }
        public int PacienteId { get; private set; }
        public string Instituicao { get; private set; } 
        public string? Resultado { get; private set; }
        public string? Observacao { get; private set; }
        public byte[]? DocumentoExame { get; private set; }

        protected Exame() { }

        private Exame(
            string tipoExame,
            DateTime dataHora,
            int pacienteId,
            string instituicao,
            string? resultado = null,
            string? observacao = null,
            byte[]? documentoExame = null
        )
        {
            TipoExame = tipoExame;
            DataHora = DateTime.SpecifyKind(dataHora, DateTimeKind.Utc);
            PacienteId = pacienteId;
            Instituicao = instituicao;
            Resultado = resultado;
            Observacao = observacao;
            DocumentoExame = documentoExame;
        }

        public static Exame Criar(
            string tipoExame,
            DateTime dataHora,
            int pacienteId,
            string instituicao,
            string? resultado = null,
            string? observacao = null,
            byte[]? documentoExame = null
        )
        {
            return new Exame(tipoExame, dataHora, pacienteId, instituicao, resultado, observacao, documentoExame);
        }

        public void Atualizar(
            string tipoExame,
            DateTime dataHora,
            int pacienteId,
            string instituicao,
            string? resultado,
            string? observacao,
            byte[]? documentoExame
        )
        {
            TipoExame = tipoExame;
            DataHora = DateTime.SpecifyKind(dataHora, DateTimeKind.Utc);
            PacienteId = pacienteId;
            Instituicao = instituicao;
            Resultado = resultado;
            Observacao = observacao;
            DocumentoExame = documentoExame;
        }
    }
}
