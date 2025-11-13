using Microsoft.EntityFrameworkCore;
using CliniData.Infra.Persistence;
using CliniData.Domain.Entities;

namespace CliniData.Api.Repositories
{
    public class ExameRepository : IExameRepository
    {
        private readonly AppDbContext _contexto;

        public ExameRepository(AppDbContext contexto)
        {
            _contexto = contexto;
        }

        public async Task<IEnumerable<Exame>> BuscarTodosAsync() =>
            await _contexto.Exame.OrderBy(e => e.DataHora).ToListAsync();

        public async Task<Exame?> BuscarPorIdAsync(int id) =>
            await _contexto.Exame.FirstOrDefaultAsync(e => e.Id == id);

        public async Task<Exame> CriarAsync(Exame exame)
        {
            _contexto.Exame.Add(exame);
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
                _contexto.Exame.Remove(exame);
                await _contexto.SaveChangesAsync();
            }
        }

        public async Task<bool> ExisteAsync(int id) =>
            await _contexto.Exame.AnyAsync(e => e.Id == id);
    }
}