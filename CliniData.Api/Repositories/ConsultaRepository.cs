using Microsoft.EntityFrameworkCore;
using CliniData.Domain.Entities;
using CliniData.Infra.Persistence;

namespace CliniData.Api.Repositories;

public class ConsultaRepository : IConsultaRepository
{
    private readonly AppDbContext _contexto;

    public ConsultaRepository(AppDbContext contexto)
    {
        _contexto = contexto;
    }

    public async Task<IEnumerable<Consulta>> BuscarTodasAsync() =>
        await _contexto.Consulta.OrderBy(c => c.DataHora).ToListAsync();

    public async Task<Consulta?> BuscarPorIdAsync(int id) =>
        await _contexto.Consulta.FirstOrDefaultAsync(c => c.Id == id);

    public async Task<Consulta> CriarAsync(Consulta consulta)
    {
        _contexto.Consulta.Add(consulta);
        await _contexto.SaveChangesAsync();
        return consulta;
    }

    public async Task<Consulta> AtualizarAsync(Consulta consulta)
    {
        // Atualização é feita via método da entidade, então apenas garantimos que o EF Core sabe que houve mudança
        _contexto.Consulta.Update(consulta);
        await _contexto.SaveChangesAsync();
        return consulta;
    }

    public async Task RemoverAsync(int id)
    {
        var consulta = await BuscarPorIdAsync(id);
        if (consulta != null)
        {
            _contexto.Consulta.Remove(consulta);
            await _contexto.SaveChangesAsync();
        }
    }

    public async Task<bool> ExisteAsync(int id) =>
        await _contexto.Consulta.AnyAsync(c => c.Id == id);
}
