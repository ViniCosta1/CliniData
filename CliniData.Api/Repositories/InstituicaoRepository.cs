using Microsoft.EntityFrameworkCore;
using CliniData.Domain.Entities;
using CliniData.Infra.Persistence;


namespace CliniData.Api.Repositories
{
    public class InstituicaoRepository : IInstituicaoRepository
    {
        private readonly AppDbContext _contexto;

        public InstituicaoRepository(AppDbContext contexto)
        {
            _contexto = contexto;
        }

        public async Task<IEnumerable<Instituicao>> BuscarTodasAsync() =>
            await _contexto.Instituicao.OrderBy(i => i.Nome).ToListAsync();

        public async Task<Instituicao?> BuscarPorIdAsync(int id) =>
            await _contexto.Instituicao.FirstOrDefaultAsync(i => i.Id == id);

        public async Task<Instituicao?> BuscarPorCnpjAsync(string cnpj) =>
            await _contexto.Instituicao.FirstOrDefaultAsync(i => i.Cnpj == cnpj);

        public async Task<Instituicao> CriarAsync(Instituicao instituicao)
        {
            _contexto.Instituicao.Add(instituicao);
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
                _contexto.Instituicao.Remove(instituicao);
                await _contexto.SaveChangesAsync();
            }
        }

        public async Task<bool> ExisteAsync(int id) =>
            await _contexto.Instituicao.AnyAsync(i => i.Id == id);

        public async Task<bool> CnpjExisteAsync(string cnpj, int? excluirId = null)
        {
            var query = _contexto.Instituicao.Where(i => i.Cnpj == cnpj);
            if (excluirId.HasValue)
                query = query.Where(i => i.Id != excluirId.Value);
            return await query.AnyAsync();
        }
        public async Task<Instituicao?> BuscarPorUserIdAsync(int userId) =>
    await _contexto.Instituicao.FirstOrDefaultAsync(i => i.UserId == userId);


    }
}