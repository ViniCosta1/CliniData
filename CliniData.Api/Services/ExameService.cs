using CliniData.Api.DTOs;
using CliniData.Api.Repositories;
using CliniData.Api.Services;
using CliniData.Domain.Entities;
using Microsoft.EntityFrameworkCore;

public class ExameService : IExameService
{
    private readonly IExameRepository _exameRepository;
    private readonly IPacienteRepository _pacienteRepository;
    private readonly IUsuarioAtualService _userAtualService;

    public ExameService(
        IExameRepository exameRepository,
        IPacienteRepository pacienteRepository,
        IUsuarioAtualService userAtualService)
    {
        _exameRepository = exameRepository;
        _pacienteRepository = pacienteRepository;
        _userAtualService = userAtualService;
    }

    public async Task<IEnumerable<ExameDto>> BuscarTodosAsync()
    {
        var exames = await _exameRepository.BuscarTodosAsync();
        return exames.Select(ExameDto.FromEntity);
    }

    public async Task<ExameDto> BuscarPorIdAsync(int id)
    {
        var exame = await _exameRepository.BuscarPorIdAsync(id)
                    ?? throw new Exception("Exame não encontrado.");

        return ExameDto.FromEntity(exame);
    }

    public async Task<IEnumerable<ExameDto>> BuscarDoPacienteAtualAsync()
    {
        var userId = _userAtualService.ObterUsuarioId();
        var paciente = await _pacienteRepository.FindByUserIdAsync(int.Parse(userId))
                      ?? throw new Exception("Paciente não encontrado para este usuário.");

        var exames = await _exameRepository.BuscarPorPacienteIdAsync(paciente.Id);

        return exames.Select(ExameDto.FromEntity);
    }

    public async Task<ExameDto> CriarAsync(CriarExameDto dto)
    {
        var userId = _userAtualService.ObterUsuarioId();
        var paciente = await _pacienteRepository.FindByUserIdAsync(int.Parse(userId))
                      ?? throw new Exception("Paciente não encontrado.");

        var exame = Exame.Criar(
            dto.TipoExame,
            dto.DataHora,
            paciente.Id,
            dto.Instituicao,
            dto.Resultado,
            dto.Observacao,
            null
        );

        var criado = await _exameRepository.CriarAsync(exame);
        return ExameDto.FromEntity(criado);
    }

    public async Task<ExameDto> CriarComArquivoAsync(CriarExameFormDto dto)
    {
        var userId = _userAtualService.ObterUsuarioId();
        var paciente = await _pacienteRepository.FindByUserIdAsync(int.Parse(userId))
                      ?? throw new Exception("Paciente não encontrado.");

        byte[]? fileBytes = null;
        string? extensao = null;

        if (dto.DocumentoExame != null)
        {
            extensao = Path.GetExtension(dto.DocumentoExame.FileName);

            using var ms = new MemoryStream();
            await dto.DocumentoExame.CopyToAsync(ms);
            fileBytes = ms.ToArray();
        }

        var exame = Exame.Criar(
            dto.TipoExame,
            dto.DataHora,
            paciente.Id,
            dto.Instituicao,
            dto.Resultado,
            dto.Observacao,
            fileBytes,
            extensao
        );

        var criado = await _exameRepository.CriarAsync(exame);
        return ExameDto.FromEntity(criado);
    }


    public async Task<ExameDto> AtualizarAsync(int id, CriarExameDto dto)
    {
        var exame = await _exameRepository.BuscarPorIdAsync(id)
                    ?? throw new Exception("Exame não encontrado.");

        exame.Atualizar(
            dto.TipoExame,
            dto.DataHora,
            exame.PacienteId,
            dto.Instituicao,
            dto.Resultado,
            dto.Observacao,
            exame.DocumentoExame,
            exame.Extensao
        );

        var atualizado = await _exameRepository.AtualizarAsync(exame);
        return ExameDto.FromEntity(atualizado);
    }

    public async Task<ExameDto> AtualizarComArquivoAsync(int id, CriarExameFormDto dto)
    {
        var exame = await _exameRepository.BuscarPorIdAsync(id)
                    ?? throw new Exception("Exame não encontrado.");

        byte[]? fileBytes = exame.DocumentoExame;
        string? extensao = exame.Extensao;

        if (dto.DocumentoExame != null)
        {
            extensao = Path.GetExtension(dto.DocumentoExame.FileName);

            using var ms = new MemoryStream();
            await dto.DocumentoExame.CopyToAsync(ms);
            fileBytes = ms.ToArray();
        }

        exame.Atualizar(
            dto.TipoExame,
            dto.DataHora,
            exame.PacienteId,
            dto.Instituicao,
            dto.Resultado,
            dto.Observacao,
            fileBytes,
            extensao
        );

        var atualizado = await _exameRepository.AtualizarAsync(exame);
        return ExameDto.FromEntity(atualizado);
    }


    public async Task RemoverAsync(int id)
    {
        await _exameRepository.RemoverAsync(id);
    }
    public async Task<IEnumerable<Exame>> ObterPorPacienteAsync(int pacienteId)
    {
        return await _exameRepository.BuscarPorPacienteIdAsync(pacienteId);
    }

    public async Task<Exame?> ObterPorIdAsync(int exameId)
    {
        return await _exameRepository.BuscarPorIdAsync(exameId);
    }
    public async Task<bool> VerificarPropriedadeDoExameAsync(int exameId, int userId)
    {
        var paciente = await _pacienteRepository.FindByUserIdAsync(userId);
        if (paciente == null) return false;

        var exame = await _exameRepository.BuscarPorIdAsync(exameId);
        if (exame == null) return false;

        return exame.PacienteId == paciente.Id;
    }


}
