using CliniData.Api.DTOs;

namespace CliniData.Api.Services
{
    public interface IHistoricoMedicoService
    {
        Task<IEnumerable<HistoricoMedicoDto>> BuscarTodosAsync();
        Task<IEnumerable<HistoricoMedicoDto>> BuscarPorPacienteAsync(int pacienteId);
        Task<HistoricoMedicoDto> BuscarPorIdAsync(int id);
        Task<HistoricoMedicoDto> CriarAsync(CriarHistoricoMedicoDto criarDto);
        Task<HistoricoMedicoDto> AtualizarAsync(int id, CriarHistoricoMedicoDto atualizarDto);
        Task RemoverAsync(int id);
    }
}