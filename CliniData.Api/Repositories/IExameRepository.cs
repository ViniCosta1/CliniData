using CliniData.Domain.Entities;

namespace CliniData.Api.Repositories
{
    public interface IExameRepository
    {
        Task<IEnumerable<Exame>> BuscarTodosAsync();
        Task<Exame?> BuscarPorIdAsync(int id);
        Task<Exame> CriarAsync(Exame exame);
        Task<Exame> AtualizarAsync(Exame exame);
        Task RemoverAsync(int id);
        Task<bool> ExisteAsync(int id);
    }
}