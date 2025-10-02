using CliniData.Api.Models;

namespace CliniData.Api.Repositories
{
    public interface IInstituicaoRepository
    {
        Task<IEnumerable<Instituicao>> BuscarTodasAsync();
        Task<Instituicao?> BuscarPorIdAsync(int id);
        Task<Instituicao?> BuscarPorCnpjAsync(string cnpj);
        Task<Instituicao> CriarAsync(Instituicao instituicao);
        Task<Instituicao> AtualizarAsync(Instituicao instituicao);
        Task RemoverAsync(int id);
        Task<bool> ExisteAsync(int id);
        Task<bool> CnpjExisteAsync(string cnpj, int? excluirId = null);
    }
}