using CliniData.Api.Models;

namespace CliniData.Api.Repositories
{
    public interface IConsultaRepository
    {
        Task<IEnumerable<Consulta>> BuscarTodasAsync();
        Task<Consulta?> BuscarPorIdAsync(int id);
        Task<Consulta> CriarAsync(Consulta consulta);
        Task<Consulta> AtualizarAsync(Consulta consulta);
        Task RemoverAsync(int id);
        Task<bool> ExisteAsync(int id);
    }
}