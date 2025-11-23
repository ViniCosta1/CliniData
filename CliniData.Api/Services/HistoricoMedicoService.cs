using CliniData.Api.DTOs;
using CliniData.Api.Repositories;
using CliniData.Api.Services;
using CliniData.Domain.Entities;

public class HistoricoMedicoService : IHistoricoMedicoService
{
    private readonly IHistoricoMedicoRepository _historicoRepo;
    private readonly IPacienteRepository _pacienteRepo;
    private readonly IMedicoRepository _medicoRepo;
    private readonly IUsuarioAtualService _userAtualService;

    public HistoricoMedicoService(
        IHistoricoMedicoRepository historicoRepo,
        IPacienteRepository pacienteRepo,
        IMedicoRepository medicoRepo,
        IUsuarioAtualService userAtualService)
    {
        _historicoRepo = historicoRepo;
        _pacienteRepo = pacienteRepo;
        _medicoRepo = medicoRepo;
        _userAtualService = userAtualService;
    }

    public async Task<IEnumerable<HistoricoMedicoDto>> BuscarPorPacienteAsync(int pacienteId)
    {
        var userId = int.Parse(_userAtualService.ObterUsuarioId());

        // paciente só pode ver dele mesmo
        var pacienteDoUsuario = await _pacienteRepo.FindByUserIdAsync(userId);
        if (pacienteDoUsuario != null && pacienteDoUsuario.Id != pacienteId)
            throw new UnauthorizedAccessException("Você não tem permissão para ver históricos de outro paciente.");

        var historicos = await _historicoRepo.BuscarPorPacienteAsync(pacienteId);
        return historicos.Select(ConverterParaDto);
    }

    public async Task<HistoricoMedicoDto> BuscarPorIdAsync(int id)
    {
        var userId = int.Parse(_userAtualService.ObterUsuarioId());
        var historico = await _historicoRepo.BuscarPorIdAsync(id)
                        ?? throw new Exception("Histórico não encontrado.");

        // paciente só acessa seus próprios registros
        var pacienteDoUsuario = await _pacienteRepo.FindByUserIdAsync(userId);
        if (pacienteDoUsuario != null && pacienteDoUsuario.Id != historico.PacienteId)
            throw new UnauthorizedAccessException("Você não tem permissão para acessar este histórico.");

        return ConverterParaDto(historico);
    }

    public async Task<HistoricoMedicoDto> CriarAsync(CriarHistoricoMedicoDto dto)
    {
        var userId = int.Parse(_userAtualService.ObterUsuarioId());
        var medico = await _medicoRepo.FindByUserIdAsync(userId)
                     ?? throw new UnauthorizedAccessException("Apenas médicos podem registrar histórico.");

        var historico = new HistoricoMedico
        {
            PacienteId = dto.PacienteId,
            MedicoId = medico.Id,
            DataRegistro = DateTime.UtcNow,
            Descricao = dto.Descricao
        };

        var criado = await _historicoRepo.CriarAsync(historico);
        return ConverterParaDto(criado);
    }

    public async Task<HistoricoMedicoDto> AtualizarAsync(int id, EditarHistoricoMedicoDto dto)
    {
        var userId = int.Parse(_userAtualService.ObterUsuarioId());
        var medico = await _medicoRepo.FindByUserIdAsync(userId)
                     ?? throw new UnauthorizedAccessException("Apenas médicos podem editar histórico.");

        var existente = await _historicoRepo.BuscarPorIdAsync(id)
                        ?? throw new Exception("Histórico não encontrado.");

        if (existente.MedicoId != medico.Id)
            throw new UnauthorizedAccessException("Você só pode editar históricos que você mesmo registrou.");

        existente.Descricao = dto.Descricao;

        var atualizado = await _historicoRepo.AtualizarAsync(existente);
        return ConverterParaDto(atualizado);
    }

    public async Task RemoverAsync(int id)
    {
        var userId = int.Parse(_userAtualService.ObterUsuarioId());
        var medico = await _medicoRepo.FindByUserIdAsync(userId)
                     ?? throw new UnauthorizedAccessException("Apenas médicos podem excluir.");

        var existente = await _historicoRepo.BuscarPorIdAsync(id)
                        ?? throw new Exception("Histórico não encontrado.");

        if (existente.MedicoId != medico.Id)
            throw new UnauthorizedAccessException("Você só pode excluir históricos que você criou.");

        await _historicoRepo.RemoverAsync(id);
    }

    private static HistoricoMedicoDto ConverterParaDto(HistoricoMedico h) => new()
    {
        IdHistorico = h.Id,
        PacienteId = h.PacienteId,
        MedicoId = h.MedicoId,
        DataRegistro = h.DataRegistro,
        Descricao = h.Descricao
    };

    public async Task<IEnumerable<HistoricoMedicoDto>> BuscarTodosDoPacienteAtualAsync()
    {
        var userId = int.Parse(_userAtualService.ObterUsuarioId());
        var paciente = await _pacienteRepo.FindByUserIdAsync(userId)
                      ?? throw new UnauthorizedAccessException("Somente pacientes podem acessar seus próprios históricos.");

        var historicos = await _historicoRepo.BuscarPorPacienteAsync(paciente.Id);
        return historicos.Select(ConverterParaDto);
    }


    public async Task<IEnumerable<HistoricoMedicoDto>> BuscarTodosDoMedicoAtualAsync()
    {
        var userId = int.Parse(_userAtualService.ObterUsuarioId());
        var medico = await _medicoRepo.FindByUserIdAsync(userId)
                    ?? throw new UnauthorizedAccessException("Somente médicos podem acessar seus próprios registros.");

        var historicos = await _historicoRepo.BuscarTodosAsync();

        return historicos
            .Where(h => h.MedicoId == medico.Id)
            .Select(ConverterParaDto);
    }

}
