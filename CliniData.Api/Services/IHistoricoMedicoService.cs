using CliniData.Api.DTOs;

public interface IHistoricoMedicoService
{
    Task<IEnumerable<HistoricoMedicoDto>> BuscarTodosDoPacienteAtualAsync();
    Task<IEnumerable<HistoricoMedicoDto>> BuscarTodosDoMedicoAtualAsync();
    Task<IEnumerable<HistoricoMedicoDto>> BuscarPorPacienteAsync(int pacienteId);
    Task<HistoricoMedicoDto> BuscarPorIdAsync(int id);
    Task<HistoricoMedicoDto> CriarAsync(CriarHistoricoMedicoDto criarDto);
    Task<HistoricoMedicoDto> AtualizarAsync(int id, EditarHistoricoMedicoDto atualizarDto);
    Task RemoverAsync(int id);
}
