using CliniData.Api.DTOs;
using CliniData.Api.Repositories;
using CliniData.Domain.Entities;

namespace CliniData.Api.Services;

public class ConsultaService : IConsultaService
{
    private readonly IConsultaRepository _repositorio;
    private readonly ILogger<ConsultaService> _logger;

    public ConsultaService(IConsultaRepository repositorio, ILogger<ConsultaService> logger)
    {
        _repositorio = repositorio;
        _logger = logger;
    }

    public async Task<IEnumerable<ConsultaDto>> BuscarTodasAsync()
    {
        var consultas = await _repositorio.BuscarTodasAsync();
        return consultas.Select(ConverterParaDto);
    }

    public async Task<ConsultaDto> BuscarPorIdAsync(int id)
    {
        var consulta = await _repositorio.BuscarPorIdAsync(id)
                       ?? throw new Exception($"Consulta com ID {id} não encontrada");
        return ConverterParaDto(consulta);
    }

    public async Task<ConsultaDto> CriarAsync(CriarConsultaDto dto)
    {
        var consulta = ConverterParaEntidade(dto);
        var criada = await _repositorio.CriarAsync(consulta);
        return ConverterParaDto(criada);
    }

    public async Task<ConsultaDto> AtualizarAsync(int id, CriarConsultaDto dto)
    {
        var existente = await _repositorio.BuscarPorIdAsync(id)
                       ?? throw new Exception($"Consulta com ID {id} não encontrada");

        AtualizarEntidadeDoDto(existente, dto);
        var atualizada = await _repositorio.AtualizarAsync(existente);
        return ConverterParaDto(atualizada);
    }

    public async Task RemoverAsync(int id)
    {
        if (!await _repositorio.ExisteAsync(id))
            throw new Exception($"Consulta com ID {id} não encontrada");

        await _repositorio.RemoverAsync(id);
    }

    // ----- Conversões -----
    private static ConsultaDto ConverterParaDto(Consulta c) => new()
    {
        IdConsulta = c.Id, // c.Id do BaseEntity
        DataHora = c.DataHora,
        PacienteId = c.PacienteId,
        MedicoId = c.MedicoId,
        InstituicaoId = c.InstituicaoId,
        Observacao = c.Observacao
    };

    private static Consulta ConverterParaEntidade(CriarConsultaDto dto) =>
        Consulta.Criar(dto.DataHora, dto.PacienteId, dto.MedicoId, dto.InstituicaoId, dto.Observacao);

    private static void AtualizarEntidadeDoDto(Consulta c, CriarConsultaDto dto)
    {
        c.Atualizar(dto.DataHora, dto.PacienteId, dto.MedicoId, dto.InstituicaoId, dto.Observacao);
    }
}
