using CliniData.Domain.Entities;
using CliniData.Infra.Persistence;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

public class MedicoInstituicaoRepository : IMedicoInstituicaoRepository
{
    private readonly AppDbContext _context;

    public MedicoInstituicaoRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<bool> JaExisteLigacaoAsync(int medicoId, int instituicaoId)
    {
        // precisa do using Microsoft.EntityFrameworkCore para AnyAsync
        return await _context.Set<Dictionary<string, object>>("medico_instituicao")
            .AnyAsync(x =>
                (int)x["medicoid"] == medicoId &&
                (int)x["instituicaoid"] == instituicaoId
            );
    }

    public async Task AdicionarAsync(int medicoId, int instituicaoId)
    {
        await _context.Set<Dictionary<string, object>>("medico_instituicao")
            .AddAsync(new Dictionary<string, object>
            {
                ["medicoid"] = medicoId,
                ["instituicaoid"] = instituicaoId
            });

        await _context.SaveChangesAsync();
    }

    public async Task RemoverAsync(int medicoId, int instituicaoId)
    {
        var entidade = await _context.Set<Dictionary<string, object>>("medico_instituicao")
            .FirstOrDefaultAsync(x =>
                (int)x["medicoid"] == medicoId &&
                (int)x["instituicaoid"] == instituicaoId
            );

        if (entidade != null)
        {
            _context.Remove(entidade);
            await _context.SaveChangesAsync();
        }
    }

    public async Task<IEnumerable<Instituicao>> BuscarInstituicoesDoMedicoAsync(int medicoId)
    {
        var medico = await _context.Medico
            .Include(m => m.Instituicoes)
            .FirstOrDefaultAsync(m => m.Id == medicoId);

        return medico?.Instituicoes ?? Enumerable.Empty<Instituicao>();
    }

    public async Task<IEnumerable<Medico>> BuscarMedicosDaInstituicaoAsync(int instituicaoId)
    {
        var instituicao = await _context.Instituicao
            .Include(i => i.Medicos)
            .FirstOrDefaultAsync(i => i.Id == instituicaoId);

        return instituicao?.Medicos ?? Enumerable.Empty<Medico>();
    }
}
