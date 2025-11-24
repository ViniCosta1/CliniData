using CliniData.Api.Repositories;
using CliniData.Api.Services;

public class MedicoInstituicaoService : IMedicoInstituicaoService
{
    private readonly IMedicoInstituicaoRepository _repositorio;
    private readonly IMedicoRepository _medicoRepo;
    private readonly IInstituicaoRepository _instituicaoRepo;
    private readonly IUsuarioAtualService _usuarioAtualService;

    public MedicoInstituicaoService(
        IMedicoInstituicaoRepository repositorio,
        IMedicoRepository medicoRepo,
        IInstituicaoRepository instituicaoRepo,
        IUsuarioAtualService usuarioAtualService)
    {
        _repositorio = repositorio;
        _medicoRepo = medicoRepo;
        _instituicaoRepo = instituicaoRepo;
        _usuarioAtualService = usuarioAtualService;
    }

    public async Task VincularAsync(VincularMedicoInstituicaoDto dto)
    {
        var userIdString = _usuarioAtualService.ObterUsuarioId();

        if (!int.TryParse(userIdString, out var userId))
            throw new Exception("Usuário não autenticado.");

        // Agora buscamos a instituição pelo USERID, não pelo ID
        var instituicao = await _instituicaoRepo.BuscarPorUserIdAsync(userId)
            ?? throw new Exception("Instituição vinculada ao usuário não encontrada.");

        int instituicaoId = instituicao.Id;

        if (!await _medicoRepo.ExisteAsync(dto.MedicoId))
            throw new Exception("Médico não encontrado.");

        if (await _repositorio.JaExisteLigacaoAsync(dto.MedicoId, instituicaoId))
            throw new Exception("Esse médico já está vinculado a esta instituição.");

        await _repositorio.AdicionarAsync(dto.MedicoId, instituicaoId);
    }

    public async Task RemoverAsync(VincularMedicoInstituicaoDto dto)
    {
        var userIdString = _usuarioAtualService.ObterUsuarioId();

        if (!int.TryParse(userIdString, out var userId))
            throw new Exception("Usuário não autenticado.");

        var instituicao = await _instituicaoRepo.BuscarPorUserIdAsync(userId)
            ?? throw new Exception("Instituição vinculada ao usuário não encontrada.");

        int instituicaoId = instituicao.Id;

        await _repositorio.RemoverAsync(dto.MedicoId, instituicaoId);
    }

    public async Task<IEnumerable<InstituicaoDeMedicoDto>> BuscarInstituicoesDoMedicoAsync(int medicoId)
    {
        var lista = await _repositorio.BuscarInstituicoesDoMedicoAsync(medicoId);

        return lista.Select(i => new InstituicaoDeMedicoDto
        {
            IdInstituicao = i.Id,
            Nome = i.Nome
        });
    }

    public async Task<IEnumerable<MedicoEmInstituicaoDto>> BuscarMedicosDaInstituicaoAsync()
    {
        var userIdString = _usuarioAtualService.ObterUsuarioId();

        if (!int.TryParse(userIdString, out var userId))
            throw new Exception("Usuário não autenticado.");

        var instituicao = await _instituicaoRepo.BuscarPorUserIdAsync(userId)
            ?? throw new Exception("Instituição vinculada ao usuário não encontrada.");

        int instituicaoId = instituicao.Id;

        var lista = await _repositorio.BuscarMedicosDaInstituicaoAsync(instituicaoId);

        return lista.Select(m => new MedicoEmInstituicaoDto
        {
            IdMedico = m.Id,
            Nome = m.Nome,
            CRM = m.CRM.Valor
        });
    }
}
