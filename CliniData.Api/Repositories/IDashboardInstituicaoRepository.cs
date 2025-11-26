using CliniData.Api.DTOs;

namespace CliniData.Api.Repositories
{
    public interface IDashboardInstituicaoRepository
    {
        Task<int> ContarMedicosDaInstituicaoAsync(int instituicaoId);
        Task<int> ContarConsultasDaInstituicaoAsync(int instituicaoId);
        Task<int> ContarPacientesDaInstituicaoAsync(int instituicaoId);
    }

}
