using System.Text.RegularExpressions;
using CliniData.Domain.Exceptions;
using CliniData.Domain.Abstractions;
using CliniData.Domain.ValueObjects;

namespace CliniData.Domain.Entities;

public sealed class Medico : BaseEntity<int>
{
    public string Nome { get; private set; }
    public CRM CRM { get; private set; } = null!;

    public int EspecialidadeId { get; private set; }
    public string? Telefone { get; private set; } = string.Empty;
    public Email Email { get; private set; } = null!;

    public EspecialidadeMedica? Especialidade { get; private set; }

    public Medico(
        string nome,
        CRM crm,
        int especialidadeId,
        string telefone,
        Email email
        )
    {
        Nome = NormalizedRequired(nome, "Nome do médico é obrigatório!");
        CRM = crm ?? thorw new BusinessRuleException("CRM é obrigatório");
        EspecialidadeId = especialidadeId > 0 ? especialidadeId : throw new BusinessRuleException("Especialidade é obrigatória.");
        Telefone = NormalizedRequired(telelfone, "Telefone é obrigatório");
        Email = email ?? throw new BusinessRuleException("Email é obrigatório");
    }

    public void AlterarNome(string nome)
    {
        Nome = NormalizedRequired(nome, "Nome do médico é obrigatório.");
        MarcarAtualizado(DateTime.UtcNow);
    }

    public void AlterarCRM(CRM crm)
    {
        CRM = crm ?? throw new BusinessRuleException("CRM é obrigatório.");
        MarcarAtualizado(DateTime.UtcNow);
    }

    public void DefinirEspecialidade(int especialidadeId)
    {
        if (especialidadeId <= 0) throw new BusinessRuleException("Especialidade inválida.");
        EspecialidadeId = especialidadeId;
        MarcarAtualizado(DateTime.UtcNow);
    }

    public void AlterarTelefone(string telefone)
    {
        Telefone = NormalizedRequired(telefone, "Telefone é obrigatório.");
        MarcarAtualizado(DateTime.UtcNow);
    }

    public void AlterarEmail(Email email)
    {
        Email = email ?? throw new BusinessRuleException("Email é obrigatório.");
        MarcarAtualizado(DateTime.UtcNow);
    }

    public static string NormalizedRequired(string valor, string erro)
    {
        if (string.IsNullOrWhiteSpace(valor)) throw new BusinessRuleException(erro);
        return valor.Trim();
    }
}