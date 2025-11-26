using CliniData.Domain.Entities;

namespace CliniData.Api.Repositories;

public interface IMedicoRepository
{
    Task<IEnumerable<Medico>> BuscarTodosAsync();
    Task<Medico?> BuscarPorIdAsync(int id);
    Task<Medico?> BuscarPorCrmAsync(string crm); // string na interface
    Task<Medico> CriarAsync(Medico medico);
    Task<Medico> AtualizarAsync(Medico medico);
    Task RemoverAsync(int id);
    Task<bool> ExisteAsync(int id);
    Task<bool> CrmExisteAsync(string crm, int? excluirId = null); // string na interface
    Task<Medico?> FindByUserIdAsync(int userId);
    Task<List<Instituicao>> BuscarInstituicoesDoMedicoAsync(int medicoId);

}

