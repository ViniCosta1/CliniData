using CliniData.Domain.Abstractions;

namespace CliniData.Domain.Entities;

public class Consulta : BaseEntity<int>
{
    public DateTime DataHora { get; private set; }
    public int PacienteId { get; private set; }
    public int MedicoId { get; private set; }
    public int? InstituicaoId { get; private set; }
    public string? Observacao { get; private set; }

    // Navegação opcional
    // public Paciente Paciente { get; private set; }
    // public Medico Medico { get; private set; }
    // public Instituicao Instituicao { get; private set; }

    protected Consulta() { } // EF Core precisa de construtor sem parâmetros

    private Consulta(DateTime dataHora, int pacienteId, int medicoId, int? instituicaoId = null, string? observacao = null)
    {
        DataHora = dataHora;
        PacienteId = pacienteId;
        MedicoId = medicoId;
        InstituicaoId = instituicaoId;
        Observacao = observacao;
    }

    public static Consulta Criar(DateTime dataHora, int pacienteId, int medicoId, int? instituicaoId = null, string? observacao = null)
    {
        return new Consulta(dataHora, pacienteId, medicoId, instituicaoId, observacao);
    }

    public void Atualizar(DateTime dataHora, int pacienteId, int medicoId, int? instituicaoId = null, string? observacao = null)
    {
        DataHora = dataHora;
        PacienteId = pacienteId;
        MedicoId = medicoId;
        InstituicaoId = instituicaoId;
        Observacao = observacao;
    }
}
