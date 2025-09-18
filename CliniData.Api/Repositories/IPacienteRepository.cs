using CliniData.Api.Models;

namespace CliniData.Api.Repositories
{
    /// <summary>
    /// Interface para o repositório de pacientes
    /// Define os métodos para acessar dados dos pacientes
    /// </summary>
    public interface IPacienteRepository
    {
        Task<IEnumerable<Paciente>> BuscarTodosAsync();
        Task<Paciente?> BuscarPorIdAsync(int id);
        Task<Paciente?> BuscarPorCpfAsync(string cpf);
        Task<Paciente> CriarAsync(Paciente paciente);
        Task<Paciente> AtualizarAsync(Paciente paciente);
        Task RemoverAsync(int id);
        Task<bool> ExisteAsync(int id);
        Task<bool> CpfExisteAsync(string cpf, int? excluirId = null);
    }
}