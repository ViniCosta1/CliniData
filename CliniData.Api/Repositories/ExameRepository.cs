using Microsoft.EntityFrameworkCore;
using CliniData.Api.Data;
using CliniData.Api.Models;

namespace CliniData.Api.Repositories
{
    public class ExameRepository : IExameRepository
    {
        private readonly CliniDataDbContext _contexto;

        public ExameRepository(CliniDataDbContext contexto)
        {
            _contexto = contexto;
        }

        public async Task<IEnumerable<Exame>> BuscarTodosAsync() =>
            await _contexto.Exames.OrderBy(e => e.DataHora).ToListAsync();

        public async Task<Exame?> BuscarPorIdAsync(int id) =>
            await _contexto.Exames.FirstOrDefaultAsync(e => e.IdExame == id);

        public async Task<Exame> CriarAsync(Exame exame)
        {
            _contexto.Exames.Add(exame);
            await _contexto.SaveChangesAsync();
            return exame;
        }

        public async Task<Exame> AtualizarAsync(Exame exame)
        {
            _contexto.Entry(exame).State = EntityState.Modified;
            await _contexto.SaveChangesAsync();
            return exame;
        }

        public async Task RemoverAsync(int id)
        {
            var exame = await BuscarPorIdAsync(id);
            if (exame != null)
            {
                _contexto.Exames.Remove(exame);
                await _contexto.SaveChangesAsync();
            }
        }

        public async Task<bool> ExisteAsync(int id) =>
            await _contexto.Exames.AnyAsync(e => e.IdExame == id);
    }
}