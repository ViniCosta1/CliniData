using Microsoft.EntityFrameworkCore;
using CliniData.Api.Data;
using CliniData.Api.Models;

namespace CliniData.Api.Repositories
{
    public class InstituicaoRepository : IInstituicaoRepository
    {
        private readonly CliniDataDbContext _contexto;

        public InstituicaoRepository(CliniDataDbContext contexto)
        {
            _contexto = contexto;
        }

        public async Task<IEnumerable<Instituicao>> BuscarTodasAsync() =>
            await _contexto.Instituicoes.OrderBy(i => i.Nome).ToListAsync();

        public async Task<Instituicao?> BuscarPorIdAsync(int id) =>
            await _contexto.Instituicoes.FirstOrDefaultAsync(i => i.IdInstituicao == id);

        public async Task<Instituicao?> BuscarPorCnpjAsync(string cnpj) =>
            await _contexto.Instituicoes.FirstOrDefaultAsync(i => i.CNPJ == cnpj);

        public async Task<Instituicao> CriarAsync(Instituicao instituicao)
        {
            _contexto.Instituicoes.Add(instituicao);
            await _contexto.SaveChangesAsync();
            return instituicao;
        }

        public async Task<Instituicao> AtualizarAsync(Instituicao instituicao)
        {
            _contexto.Entry(instituicao).State = EntityState.Modified;
            await _contexto.SaveChangesAsync();
            return instituicao;
        }

        public async Task RemoverAsync(int id)
        {
            var instituicao = await BuscarPorIdAsync(id);
            if (instituicao != null)
            {
                _contexto.Instituicoes.Remove(instituicao);
                await _contexto.SaveChangesAsync();
            }
        }

        public async Task<bool> ExisteAsync(int id) =>
            await _contexto.Instituicoes.AnyAsync(i => i.IdInstituicao == id);

        public async Task<bool> CnpjExisteAsync(string cnpj, int? excluirId = null)
        {
            var query = _contexto.Instituicoes.Where(i => i.CNPJ == cnpj);
            if (excluirId.HasValue)
                query = query.Where(i => i.IdInstituicao != excluirId.Value);
            return await query.AnyAsync();
        }
    }
}