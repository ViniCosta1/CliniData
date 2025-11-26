using CliniData.Api.DTOs;
using CliniData.Api.Repositories;
using CliniData.Domain.Entities;

namespace CliniData.Api.Services;

public class ConsultaService : IConsultaService
{
    private readonly IConsultaRepository _repositorio;
    private readonly IMedicoRepository _medicoRepository;
    private readonly IPacienteRepository _pacienteRepository;
    private readonly ILogger<ConsultaService> _logger;
    private readonly IUsuarioAtualService _usuarioAtual;

    public ConsultaService(
        IConsultaRepository repositorio,
        IMedicoRepository medicoRepository,
        IPacienteRepository pacienteRepository,
        ILogger<ConsultaService> logger,
        IUsuarioAtualService usuarioAtual)
    {
        _repositorio = repositorio;
        _medicoRepository = medicoRepository;
        _pacienteRepository = pacienteRepository;
        _logger = logger;
        _usuarioAtual = usuarioAtual;
    }

    // ===============================================================
    // MÉDICO → BUSCAR TODAS
    // ===============================================================
    public async Task<IEnumerable<ConsultaDto>> BuscarTodasDoMedicoAtualAsync()
    {
        var userIdString = _usuarioAtual.ObterUsuarioId();
        if (!int.TryParse(userIdString, out int userId))
            return Enumerable.Empty<ConsultaDto>();

        var medico = await _medicoRepository.FindByUserIdAsync(userId);
        if (medico == null)
            return Enumerable.Empty<ConsultaDto>();

        var consultas = await _repositorio.BuscarPorMedicoIdAsync(medico.Id);
        return consultas.Select(ConverterParaDto);
    }

    // ===============================================================
    // PACIENTE → BUSCAR TODAS
    // ===============================================================
    public async Task<IEnumerable<ConsultaDto>> BuscarTodasDoPacienteAtualAsync()
    {
        var userIdString = _usuarioAtual.ObterUsuarioId();
        if (!int.TryParse(userIdString, out int userId))
            return Enumerable.Empty<ConsultaDto>();

        var paciente = await _pacienteRepository.FindByUserIdAsync(userId);
        if (paciente == null)
            return Enumerable.Empty<ConsultaDto>();

        var consultas = await _repositorio.BuscarPorPacienteIdAsync(paciente.Id);
        return consultas.Select(ConverterParaDto);
    }

    // ===============================================================
    // BUSCAR POR ID
    // ===============================================================
    public async Task<ConsultaDto?> BuscarPorIdAsync(int id)
    {
        var consulta = await _repositorio.BuscarPorIdAsync(id);
        return consulta == null ? null : ConverterParaDto(consulta);
    }

    // ===============================================================
    // CRIAR CONSULTA
    // ===============================================================
    public async Task<ConsultaDto> CriarAsync(CriarConsultaDto dto)

    {

        
        var userIdString = _usuarioAtual.ObterUsuarioId();

        if (!int.TryParse(userIdString, out int userId))
            throw new Exception("Usuário não autenticado.");

        var medico = await _medicoRepository.FindByUserIdAsync(userId)
                     ?? throw new Exception("Nenhum médico associado ao usuário atual.");

        var consulta = Consulta.Criar(
            dto.DataHora,
            dto.PacienteId,
            medico.Id,
            dto.InstituicaoId,
            dto.Observacao
        );

        var criada = await _repositorio.CriarAsync(consulta);
        return ConverterParaDto(criada);
    }

    // ===============================================================
    // ATUALIZAR
    // ===============================================================
    public async Task<ConsultaDto> AtualizarAsync(int id, EditarConsultaDto dto)
    {
        var userIdString = _usuarioAtual.ObterUsuarioId();
        if (!int.TryParse(userIdString, out int userId))
            throw new Exception("Usuário não autenticado.");

        var medico = await _medicoRepository.FindByUserIdAsync(userId)
                     ?? throw new Exception("Nenhum médico associado ao usuário atual.");

        var existente = await _repositorio.BuscarPorIdAsync(id)
                       ?? throw new Exception($"Consulta com ID {id} não encontrada.");

        if (existente.MedicoId != medico.Id)
            throw new UnauthorizedAccessException("Você não pode alterar esta consulta.");

        existente.Atualizar(dto.Observacao);

        var atualizada = await _repositorio.AtualizarAsync(existente);
        return ConverterParaDto(atualizada);
    }

    // ===============================================================
    // REMOVER
    // ===============================================================
    public async Task RemoverAsync(int id)
    {
        var userIdString = _usuarioAtual.ObterUsuarioId();
        if (!int.TryParse(userIdString, out int userId))
            throw new Exception("Usuário não autenticado.");

        var medico = await _medicoRepository.FindByUserIdAsync(userId)
                     ?? throw new Exception("Nenhum médico associado ao usuário atual.");

        var consulta = await _repositorio.BuscarPorIdAsync(id)
                       ?? throw new Exception($"Consulta com ID {id} não encontrada");

        if (consulta.MedicoId != medico.Id)
            throw new UnauthorizedAccessException("Você não pode excluir esta consulta.");

        await _repositorio.RemoverAsync(id);
    }

    // ===============================================================
    // DTO
    // ===============================================================
    private static ConsultaDto ConverterParaDto(Consulta c) => new()
    {
        IdConsulta = c.Id,
        DataHora = c.DataHora,
        PacienteId = c.PacienteId,
        MedicoId = c.MedicoId,
        InstituicaoId = c.InstituicaoId,
        Observacao = c.Observacao,
        Paciente = c.Paciente == null ? null : new PacienteDto
        {
            IdPaciente = c.Paciente.Id,
            Nome = c.Paciente.Nome,
            DataNascimento = c.Paciente.DataNascimento,
            Sexo = c.Paciente.Sexo.ToString(),
            CPF = c.Paciente.CPF.Valor,
            Telefone = c.Paciente.Telefone,
            Email = c.Paciente.Email.Valor,
            Rua = c.Paciente.Endereco.Rua,
            Numero = c.Paciente.Endereco.Numero,
            Complemento = c.Paciente.Endereco.Complemento,
            Bairro = c.Paciente.Endereco.Bairro,
            Cidade = c.Paciente.Endereco.Cidade,
            Estado = c.Paciente.Endereco.UF,
            CEP = c.Paciente.Endereco.CEP
        },

        // ============================
        // MAPEAR MÉDICO
        // ============================
        Medico = c.Medico == null ? null : new MedicoDto
        {
            IdMedico = c.Medico.Id,
            Nome = c.Medico.Nome,
            CRM = c.Medico.CRM.Valor,
            EspecialidadeMedicaId = c.Medico.EspecialidadeMedicaId,
            Telefone = c.Medico.Telefone,
            Email = c.Medico.Email.Valor
        },
        Instituicao = c.Instituicao == null ? null : new InstituicaoDto
        {
            IdInstituicao = c.Instituicao.Id,
            Nome = c.Instituicao.Nome,
            Email = c.Instituicao.Email,
            CNPJ = c.Instituicao.Cnpj,
            Telefone = c.Instituicao.Telefone,
            Rua = c.Instituicao.Rua,
            Numero = c.Instituicao.Numero,
            Bairro = c.Instituicao.Bairro,
            Cidade = c.Instituicao.Cidade,
            Estado = c.Instituicao.Estado,
            CEP = c.Instituicao.Cep
        }
    };
}
