using CliniData.Domain.Entities;
using CliniData.Domain.ValueObjects;
using CliniData.Infra.Persistence;
using Microsoft.EntityFrameworkCore;

namespace CliniData.Api.Repositories;

public class PacienteRepository : IPacienteRepository
{
    private readonly AppDbContext _context;

    public PacienteRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Paciente>> BuscarTodosAsync()
    {
        return await _context.Paciente
            .Include(p => p.Endereco)
            .OrderBy(p => p.Nome)
            .ToListAsync();
    }

    public async Task<Paciente?> BuscarPorIdAsync(int id)
    {
        return await _context.Paciente
            .Include(p => p.Endereco)
            .FirstOrDefaultAsync(p => p.Id == id);
    }

    public async Task<Paciente?> BuscarPorCpfAsync(string cpf)
    {
        var vo = new CPF(cpf);
        return await _context.Paciente
            .Include(p => p.Endereco)
            .FirstOrDefaultAsync(p => p.CPF.Valor == vo.Valor);
    }

    public async Task<Paciente> CriarAsync(Paciente paciente)
    {
        _context.Paciente.Add(paciente);
        if (paciente.Endereco != null)
            _context.Endereco.Add(paciente.Endereco);

        await _context.SaveChangesAsync();
        return paciente;
    }

    public async Task<Paciente> AtualizarAsync(Paciente paciente)
    {
        _context.Entry(paciente).State = EntityState.Modified;
        if (paciente.Endereco != null)
            _context.Entry(paciente.Endereco).State = EntityState.Modified;

        await _context.SaveChangesAsync();
        return paciente;
    }

    public async Task RemoverAsync(int id)
    {
        var paciente = await BuscarPorIdAsync(id);
        if (paciente != null)
        {
            _context.Paciente.Remove(paciente);
            await _context.SaveChangesAsync();
        }
    }

    public async Task<bool> ExisteAsync(int id)
    {
        return await _context.Paciente.AnyAsync(p => p.Id == id);
    }

    public async Task<bool> CpfExisteAsync(string cpf, int? excluirId = null)
    {
        var vo = new CPF(cpf);
        var query = _context.Paciente.Where(p => p.CPF.Valor == vo.Valor);

        if (excluirId.HasValue)
            query = query.Where(p => p.Id != excluirId.Value);

        return await query.AnyAsync();
    }

    public async Task<Paciente?> FindByUserIdAsync(int userId)
    {
        return await _context.Paciente
            .Include(p => p.Endereco)
            .FirstOrDefaultAsync(p => p.UserId == userId);
    }


}
