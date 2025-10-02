using Microsoft.EntityFrameworkCore;
using CliniData.Api.Data;
using CliniData.Api.Models;

namespace CliniData.Api.Repositories
{
    public class HistoricoMedicoRepository : IHistoricoMedicoRepository
    {
        private readonly CliniDataDbContext _contexto;

        public HistoricoMedicoRepository(CliniDataDbContext contexto)
        {
            _contexto = contexto;
        }

        public async Task<IEnumerable<HistoricoMedico>> BuscarTodosAsync() =>
            await _contexto.HistoricosMedicos.OrderBy(h => h.DataRegistro).ToListAsync();

        public async Task<IEnumerable<HistoricoMedico>> BuscarPorPacienteAsync(int pacienteId) =>
            await _contexto.HistoricosMedicos.Where(h => h.PacienteId == pacienteId)
                .OrderBy(h => h.DataRegistro).ToListAsync();

        public async Task<HistoricoMedico?> BuscarPorIdAsync(int id) =>
            await _contexto.HistoricosMedicos.FirstOrDefaultAsync(h => h.IdHistorico == id);

        public async Task<HistoricoMedico> CriarAsync(HistoricoMedico historico)
        {
            _contexto.HistoricosMedicos.Add(historico);
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
                _contexto.HistoricosMedicos.Remove(historico);
                await _contexto.SaveChangesAsync();
            }
        }

        public async Task<bool> ExisteAsync(int id) =>
            await _contexto.HistoricosMedicos.AnyAsync(h => h.IdHistorico == id);
    }
}