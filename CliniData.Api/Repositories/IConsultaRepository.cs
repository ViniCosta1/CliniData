using CliniData.Domain.Entities;

namespace CliniData.Api.Repositories
{
    public interface IConsultaRepository
    {
        Task<IEnumerable<Consulta>> BuscarTodasAsync();
        Task<Consulta?> BuscarPorIdAsync(int id);
        Task<Consulta> CriarAsync(Consulta consulta);
        Task<Consulta> AtualizarAsync(Consulta consulta);
        Task RemoverAsync(int id);
        Task<bool> ExisteAsync(int id);
        Task<IEnumerable<Consulta>> BuscarPorMedicoIdAsync(int medicoId);
        Task<IEnumerable<Consulta>> BuscarPorPacienteIdAsync(int pacienteId);
        Task<IEnumerable<Consulta>> BuscarPorInstituicaoIdAsync(int instituicaoId);


    }
}