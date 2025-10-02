using CliniData.Api.DTOs;

namespace CliniData.Api.Services
{
    public interface IInstituicaoService
    {
        Task<IEnumerable<InstituicaoDto>> BuscarTodasAsync();
        Task<InstituicaoDto> BuscarPorIdAsync(int id);
        Task<InstituicaoDto> BuscarPorCnpjAsync(string cnpj);
        Task<InstituicaoDto> CriarAsync(CriarInstituicaoDto criarDto);
        Task<InstituicaoDto> AtualizarAsync(int id, CriarInstituicaoDto atualizarDto);
        Task RemoverAsync(int id);
    }
}