using CliniData.Domain.Entities;
using CliniData.Domain.ValueObjects;
using CliniData.Infra.Persistence;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace CliniData.Api.Repositories;

public class MedicoRepository : IMedicoRepository
{
    private readonly AppDbContext _context;

    public MedicoRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Medico>> BuscarTodosAsync()
    {
        return await _context.Medico
            .Include(m => m.EspecialidadeMedica)
            .OrderBy(m => m.Nome)
            .ToListAsync();
    }

    public async Task<Medico?> BuscarPorIdAsync(int id)
    {
        return await _context.Medico
            .Include(m => m.EspecialidadeMedica)
            .FirstOrDefaultAsync(m => m.Id == id);
    }

    public async Task<Medico?> BuscarPorCrmAsync(string crm)
    {
        var vo = new CRM(crm);
        return await _context.Medico
            .Include(m => m.EspecialidadeMedica)
            .FirstOrDefaultAsync(m => m.CRM.Valor == vo.Valor);
    }

    public async Task<Medico> CriarAsync(Medico medico)
    {
        _context.Medico.Add(medico);
        await _context.SaveChangesAsync();
        return medico;
    }

    public async Task<Medico> AtualizarAsync(Medico medico)
    {
        _context.Entry(medico).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        return medico;
    }

    public async Task RemoverAsync(int id)
    {
        var medico = await BuscarPorIdAsync(id);
        if (medico != null)
        {
            _context.Medico.Remove(medico);
            await _context.SaveChangesAsync();
        }
    }

    public async Task<bool> ExisteAsync(int id)
    {
        return await _context.Medico.AnyAsync(m => m.Id == id);
    }

    public async Task<bool> CrmExisteAsync(string crm, int? excluirId = null)
    {
        var vo = new CRM(crm);
        var query = _context.Medico.Where(m => m.CRM.Valor == vo.Valor);

        if (excluirId.HasValue)
            query = query.Where(m => m.Id != excluirId.Value);

        return await query.AnyAsync();
    }

    public async Task<Medico> FindByUserIdAsync(int userId)
    {
        return await _context.Medico
            .FirstOrDefaultAsync(m => m.UserId == userId);
    }


}
