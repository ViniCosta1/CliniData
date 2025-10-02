using Microsoft.EntityFrameworkCore;
using CliniData.Api.Data;
using CliniData.Api.Models;

namespace CliniData.Api.Repositories
{
    public class ConsultaRepository : IConsultaRepository
    {
        private readonly CliniDataDbContext _contexto;

        public ConsultaRepository(CliniDataDbContext contexto)
        {
            _contexto = contexto;
        }

        public async Task<IEnumerable<Consulta>> BuscarTodasAsync() =>
            await _contexto.Consultas.OrderBy(c => c.DataHora).ToListAsync();

        public async Task<Consulta?> BuscarPorIdAsync(int id) =>
            await _contexto.Consultas.FirstOrDefaultAsync(c => c.IdConsulta == id);

        public async Task<Consulta> CriarAsync(Consulta consulta)
        {
            _contexto.Consultas.Add(consulta);
            await _contexto.SaveChangesAsync();
            return consulta;
        }

        public async Task<Consulta> AtualizarAsync(Consulta consulta)
        {
            _contexto.Entry(consulta).State = EntityState.Modified;
            await _contexto.SaveChangesAsync();
            return consulta;
        }

        public async Task RemoverAsync(int id)
        {
            var consulta = await BuscarPorIdAsync(id);
            if (consulta != null)
            {
                _contexto.Consultas.Remove(consulta);
                await _contexto.SaveChangesAsync();
            }
        }

        public async Task<bool> ExisteAsync(int id) =>
            await _contexto.Consultas.AnyAsync(c => c.IdConsulta == id);
    }
}