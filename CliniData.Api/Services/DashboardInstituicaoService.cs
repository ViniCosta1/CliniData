using CliniData.Api.DTOs;
using CliniData.Api.Repositories;
using CliniData.Api.Services;

public class DashboardInstituicaoService : IDashboardInstituicaoService
{


    private readonly IDashboardInstituicaoRepository _repo;
    private readonly IInstituicaoRepository _instituicaoRepo;
    private readonly IUsuarioAtualService _usuarioAtual;

    public DashboardInstituicaoService(
        IDashboardInstituicaoRepository repo,
        IInstituicaoRepository instituicaoRepo,
        IUsuarioAtualService usuarioAtual
        )
    {
        _repo = repo;
        _instituicaoRepo = instituicaoRepo;
        _usuarioAtual = usuarioAtual;
    }

    public async Task<DashboardInstituicaoDto> BuscarDadosDaInstituicaoAtualAsync()
    {


        // 1. usuário atual
        var userIdString = _usuarioAtual.ObterUsuarioId();
        if (!int.TryParse(userIdString, out int userId))
            return new DashboardInstituicaoDto();

        // 2. buscar instituição pelo USER ID
        var instituicao = await _instituicaoRepo.BuscarPorUserIdAsync(userId);
        if (instituicao == null)
            return new DashboardInstituicaoDto();

        int instId = instituicao.Id;

        // 3. contagens
        var totalMedicos = await _repo.ContarMedicosDaInstituicaoAsync(instId);
        var totalConsultas = await _repo.ContarConsultasDaInstituicaoAsync(instId);
        var totalPacientes = await _repo.ContarPacientesDaInstituicaoAsync(instId);

        return new DashboardInstituicaoDto
        {
            TotalMedicos = totalMedicos,
            TotalConsultas = totalConsultas,
            TotalPacientes = totalPacientes
        };
    }
}
