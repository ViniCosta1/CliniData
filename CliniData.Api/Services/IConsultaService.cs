using CliniData.Api.DTOs;

namespace CliniData.Api.Services
{
    public interface IConsultaService
    {
        Task<IEnumerable<ConsultaDto>> BuscarTodasAsync();
        Task<ConsultaDto> BuscarPorIdAsync(int id);
        Task<ConsultaDto> CriarAsync(CriarConsultaDto criarDto);
        Task<ConsultaDto> AtualizarAsync(int id, CriarConsultaDto atualizarDto);
        Task RemoverAsync(int id);
    }
}