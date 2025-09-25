using Microsoft.EntityFrameworkCore;
using CliniData.Api.Data;
using CliniData.Api.Models;

namespace CliniData.Api.Repositories
{
    public class MedicoRepository : IMedicoRepository
    {
        private readonly CliniDataDbContext _contexto;

        public MedicoRepository(CliniDataDbContext contexto) => _contexto = contexto;

        public async Task<IEnumerable<Medico>> BuscarTodosAsync() =>
            await _contexto.Medicos.OrderBy(m => m.Nome).ToListAsync();

        public async Task<Medico?> BuscarPorIdAsync(int id) =>
            await _contexto.Medicos.FirstOrDefaultAsync(m => m.IdMedico == id);

        public async Task<Medico?> BuscarPorCrmAsync(string crm) =>
            await _contexto.Medicos.FirstOrDefaultAsync(m => m.CRM == crm);

        public async Task<Medico> CriarAsync(Medico medico)
        {
            _contexto.Medicos.Add(medico);
            await _contexto.SaveChangesAsync();
            return medico;
        }

        public async Task<Medico> AtualizarAsync(Medico medico)
        {
            _contexto.Entry(medico).State = EntityState.Modified;
            await _contexto.SaveChangesAsync();
            return medico;
        }

        public async Task RemoverAsync(int id)
        {
            var medico = await BuscarPorIdAsync(id);
            if (medico != null)
            {
                _contexto.Medicos.Remove(medico);
                await _contexto.SaveChangesAsync();
            }
        }

        public async Task<bool> ExisteAsync(int id) =>
            await _contexto.Medicos.AnyAsync(m => m.IdMedico == id);

        public async Task<bool> CrmExisteAsync(string crm, int? excluirId = null)
        {
            var query = _contexto.Medicos.Where(m => m.CRM == crm);
            if (excluirId.HasValue)
                query = query.Where(m => m.IdMedico != excluirId.Value);
            return await query.AnyAsync();
        }
    }
}