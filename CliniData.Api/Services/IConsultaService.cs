using CliniData.Api.DTOs;

namespace CliniData.Api.Services
{
    public interface IConsultaService
    {
        Task<IEnumerable<ConsultaDto>> BuscarTodasDoMedicoAtualAsync();
        Task<ConsultaDto> BuscarPorIdAsync(int id);
        Task<ConsultaDto> CriarAsync(CriarConsultaDto criarDto);
        Task<ConsultaDto> AtualizarAsync(int id, EditarConsultaDto atualizarDto);
        Task RemoverAsync(int id);
        Task<IEnumerable<ConsultaDto>> BuscarTodasDoPacienteAtualAsync();

    }
}