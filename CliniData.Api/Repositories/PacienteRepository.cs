using Microsoft.EntityFrameworkCore;
using CliniData.Api.Data;
using CliniData.Api.Models;

namespace CliniData.Api.Repositories
{
    /// <summary>
    /// Implementação do repositório de pacientes
    /// Responsável por fazer operações no banco de dados
    /// </summary>
    public class PacienteRepository : IPacienteRepository
    {
        private readonly CliniDataDbContext _contexto;

        public PacienteRepository(CliniDataDbContext contexto)
        {
            _contexto = contexto;
        }

        /// <summary>
        /// Busca todos os pacientes
        /// </summary>
        public async Task<IEnumerable<Paciente>> BuscarTodosAsync()
        {
            return await _contexto.Pacientes
                .OrderBy(p => p.Nome)
                .ToListAsync();
        }

        /// <summary>
        /// Busca paciente por ID
        /// </summary>
        public async Task<Paciente?> BuscarPorIdAsync(int id)
        {
            return await _contexto.Pacientes
                .FirstOrDefaultAsync(p => p.IdPaciente == id);
        }

        /// <summary>
        /// Busca paciente por CPF
        /// </summary>
        public async Task<Paciente?> BuscarPorCpfAsync(string cpf)
        {
            return await _contexto.Pacientes
                .FirstOrDefaultAsync(p => p.CPF == cpf);
        }

        /// <summary>
        /// Cria um novo paciente
        /// </summary>
        public async Task<Paciente> CriarAsync(Paciente paciente)
        {
            _contexto.Pacientes.Add(paciente);
            await _contexto.SaveChangesAsync();
            return paciente;
        }

        /// <summary>
        /// Atualiza um paciente existente
        /// </summary>
        public async Task<Paciente> AtualizarAsync(Paciente paciente)
        {
            _contexto.Entry(paciente).State = EntityState.Modified;
            await _contexto.SaveChangesAsync();
            return paciente;
        }

        /// <summary>
        /// Remove um paciente
        /// </summary>
        public async Task RemoverAsync(int id)
        {
            var paciente = await BuscarPorIdAsync(id);
            if (paciente != null)
            {
                _contexto.Pacientes.Remove(paciente);
                await _contexto.SaveChangesAsync();
            }
        }

        /// <summary>
        /// Verifica se um paciente existe
        /// </summary>
        public async Task<bool> ExisteAsync(int id)
        {
            return await _contexto.Pacientes.AnyAsync(p => p.IdPaciente == id);
        }

        /// <summary>
        /// Verifica se um CPF já está cadastrado
        /// </summary>
        public async Task<bool> CpfExisteAsync(string cpf, int? excluirId = null)
        {
            var query = _contexto.Pacientes.Where(p => p.CPF == cpf);

            if (excluirId.HasValue)
            {
                query = query.Where(p => p.IdPaciente != excluirId.Value);
            }

            return await query.AnyAsync();
        }
    }
}