using CliniData.Domain.Entities;

namespace CliniData.Api.Repositories;

public interface IPacienteRepository
{
    Task<IEnumerable<Paciente>> BuscarTodosAsync();
    Task<Paciente?> BuscarPorIdAsync(int id);
    Task<Paciente?> BuscarPorCpfAsync(string cpf); // string na interface
    Task<Paciente> CriarAsync(Paciente paciente);
    Task<Paciente> AtualizarAsync(Paciente paciente);
    Task RemoverAsync(int id);
    Task<bool> ExisteAsync(int id);
    Task<bool> CpfExisteAsync(string cpf, int? excluirId = null); // string na interface
}
