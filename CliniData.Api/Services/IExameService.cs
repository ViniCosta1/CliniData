using CliniData.Api.DTOs;

namespace CliniData.Api.Services
{
    public interface IExameService
    {
        Task<IEnumerable<ExameDto>> BuscarTodosAsync();
        Task<ExameDto> BuscarPorIdAsync(int id);
        Task<ExameDto> CriarAsync(CriarExameDto criarDto);
        Task<ExameDto> AtualizarAsync(int id, CriarExameDto atualizarDto);
        Task RemoverAsync(int id);
    }
}