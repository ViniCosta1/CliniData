using CliniData.Domain.Entities;
using CliniData.Infra.Persistence;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CliniData.Api.Repositories;

public class ConsultaRepository : IConsultaRepository
{
    private readonly AppDbContext _contexto;
    
    public ConsultaRepository(AppDbContext contexto)
    {
        _contexto = contexto;
    

    }

    public async Task<IEnumerable<Consulta>> BuscarTodasAsync() =>
        await _contexto.Consulta.Include(p => p.Paciente).Include(m => m.Medico).Include(i => i.Instituicao).OrderBy(c => c.DataHora).ToListAsync();

    public async Task<Consulta?> BuscarPorIdAsync(int id) =>
        await _contexto.Consulta.Include(p => p.Paciente).Include(m => m.Medico).Include(i => i.Instituicao).FirstOrDefaultAsync(c => c.Id == id);

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

    public async Task<IEnumerable<Consulta>> BuscarPorMedicoIdAsync(int medicoId)
    {
        return await _contexto.Consulta.Include(p => p.Paciente).Include(m => m.Medico).Include(i => i.Instituicao)
            .Where(c => c.MedicoId == medicoId)
            .OrderBy(c => c.DataHora)
            .ToListAsync();
    }

    public async Task<IEnumerable<Consulta>> BuscarPorPacienteIdAsync(int pacienteId)
    {
        return await _contexto.Consulta.Include(p => p.Paciente).Include(m => m.Medico).Include(i => i.Instituicao)
            .Where(c => c.PacienteId == pacienteId)
            .OrderBy(c => c.DataHora)
            .ToListAsync();
    }



}
