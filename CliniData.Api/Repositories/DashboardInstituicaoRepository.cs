using CliniData.Api.Repositories;
using CliniData.Infra.Persistence;
using Microsoft.EntityFrameworkCore;

public class DashboardInstituicaoRepository : IDashboardInstituicaoRepository
{
    private readonly AppDbContext _context;

    public DashboardInstituicaoRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<int> ContarMedicosDaInstituicaoAsync(int instituicaoId)
    {
        
        return await _context.Medico
            .Where(m => m.InstituicoesVinculos.Any(i => i.InstituicaoId== instituicaoId))
            .CountAsync();
    }

    public async Task<int> ContarConsultasDaInstituicaoAsync(int instituicaoId)
    {
        return await _context.Consulta
            .Where(c => c.InstituicaoId == instituicaoId)
            .CountAsync();
    }

    public async Task<int> ContarPacientesDaInstituicaoAsync(int instituicaoId)
    {
        return await _context.Consulta
            .Where(c => c.InstituicaoId == instituicaoId)
            .Select(c => c.PacienteId)
            .Distinct()
            .CountAsync();
    }
}
