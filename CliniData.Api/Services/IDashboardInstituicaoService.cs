using CliniData.Api.DTOs;

namespace CliniData.Api.Services
{
    public interface IDashboardInstituicaoService
    {
        Task<DashboardInstituicaoDto> BuscarDadosDaInstituicaoAtualAsync();
    }
}
