using Microsoft.EntityFrameworkCore;
using CliniData.Domain.Entities;
using CliniData.Infra.Persistence;

namespace CliniData.Api.Repositories
{
    public class HistoricoMedicoRepository : IHistoricoMedicoRepository
    {
        private readonly AppDbContext _contexto;

        public HistoricoMedicoRepository(AppDbContext contexto)
        {
            _contexto = contexto;
        }

        public async Task<IEnumerable<HistoricoMedico>> BuscarTodosAsync() =>
            await _contexto.HistoricosMedico.OrderBy(h => h.DataRegistro).ToListAsync();

        public async Task<IEnumerable<HistoricoMedico>> BuscarPorPacienteAsync(int pacienteId) =>
            await _contexto.HistoricosMedico.Where(h => h.PacienteId == pacienteId)
                .OrderBy(h => h.DataRegistro).ToListAsync();

        public async Task<HistoricoMedico?> BuscarPorIdAsync(int id) =>
            await _contexto.HistoricosMedico.FirstOrDefaultAsync(h => h.Id == id);

        public async Task<HistoricoMedico> CriarAsync(HistoricoMedico historico)
        {
            _contexto.HistoricosMedico.Add(historico);
            await _contexto.SaveChangesAsync();
            return historico;
        }

        public async Task<HistoricoMedico> AtualizarAsync(HistoricoMedico historico)
        {
            _contexto.Entry(historico).State = EntityState.Modified;
            await _contexto.SaveChangesAsync();
            return historico;
        }

        public async Task RemoverAsync(int id)
        {
            var historico = await BuscarPorIdAsync(id);
            if (historico != null)
            {
                _contexto.HistoricosMedico.Remove(historico);
                await _contexto.SaveChangesAsync();
            }
        }

        public async Task<bool> ExisteAsync(int id) =>
            await _contexto.HistoricosMedico.AnyAsync(h => h.Id == id);
    }
}