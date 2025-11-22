using CliniData.Domain.Entities;
using CliniData.Infra.Persistence;
using Microsoft.EntityFrameworkCore;

namespace CliniData.Api.Repositories
{
    public class ExameRepository : IExameRepository
    {
        private readonly AppDbContext _context;

        public ExameRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Exame>> BuscarTodosAsync()
        {
            return await _context.Exame.ToListAsync();
        }

        public async Task<Exame?> BuscarPorIdAsync(int id)
        {
            return await _context.Exame.FirstOrDefaultAsync(e => e.Id == id);
        }

        public async Task<Exame> CriarAsync(Exame exame)
        {
            _context.Exame.Add(exame);
            await _context.SaveChangesAsync();
            return exame;
        }

        public async Task<Exame> AtualizarAsync(Exame exame)
        {
            _context.Entry(exame).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return exame;
        }

        public async Task RemoverAsync(int id)
        {
            var exame = await BuscarPorIdAsync(id);
            if (exame != null)
            {
                _context.Exame.Remove(exame);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<bool> ExisteAsync(int id)
        {
            return await _context.Exame.AnyAsync(e => e.Id == id);
        }

        // 🔥 ADICIONADO
        public async Task<IEnumerable<Exame>> BuscarPorPacienteIdAsync(int pacienteId)
        {
            return await _context.Exame
                .Where(e => e.PacienteId == pacienteId)
                .ToListAsync();
        }
    }
}
