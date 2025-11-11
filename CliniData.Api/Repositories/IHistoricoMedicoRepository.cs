using CliniData.Domain.Entities;

namespace CliniData.Api.Repositories
{
    public interface IHistoricoMedicoRepository
    {
        Task<IEnumerable<HistoricoMedico>> BuscarTodosAsync();
        Task<IEnumerable<HistoricoMedico>> BuscarPorPacienteAsync(int pacienteId);
        Task<HistoricoMedico?> BuscarPorIdAsync(int id);
        Task<HistoricoMedico> CriarAsync(HistoricoMedico historico);
        Task<HistoricoMedico> AtualizarAsync(HistoricoMedico historico);
        Task RemoverAsync(int id);
        Task<bool> ExisteAsync(int id);
    }
}