using CliniData.Api.DTOs;

namespace CliniData.Api.Services
{
    /// <summary>
    /// Interface para o serviço de pacientes
    /// Define a lógica de negócio para pacientes
    /// </summary>
    public interface IPacienteService
    {
        Task<IEnumerable<PacienteDto>> BuscarTodosAsync();
        Task<PacienteDto> BuscarPorIdAsync(int id);
        Task<PacienteDto> BuscarPorCpfAsync(string cpf);
        Task<PacienteDto> CriarAsync(CriarPacienteDto criarDto);
        Task<PacienteDto> AtualizarAsync(int id, CriarPacienteDto atualizarDto);
        Task RemoverAsync(int id);
    }
}