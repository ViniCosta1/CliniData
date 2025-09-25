using CliniData.Domain.Abstractions;
using CliniData.Domain.Exceptions;

namespace CliniData.Domain.Entities;

public sealed class EspecialidadeMedica : BaseEntity<int>
{
    public string NomeEspecialidade { get; private set; } = string.Empty;
    private EspecialidadeMedica()
    {

    }

    public EspecialidadeMedica(string nomeEspecialidade)
    {
        NomeEspecialidade = string.IsNullOrEmpty(nomeEspecialidade) ? throw new BusinessRuleException("Nome da especialidade é obrigatório!") : nomeEspecialidade.Trim(); 
    }

    public override string ToString() => NomeEspecialidade;
}