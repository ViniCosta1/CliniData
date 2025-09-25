using CliniData.Api.DTOs;

namespace CliniData.Api.Services
{
    public interface IMedicoService
    {
        Task<IEnumerable<MedicoDto>> BuscarTodosAsync();
        Task<MedicoDto> BuscarPorIdAsync(int id);
        Task<MedicoDto> BuscarPorCrmAsync(string crm);
        Task<MedicoDto> CriarAsync(CriarMedicoDto criarDto);
        Task<MedicoDto> AtualizarAsync(int id, CriarMedicoDto atualizarDto);
        Task RemoverAsync(int id);
    }
}