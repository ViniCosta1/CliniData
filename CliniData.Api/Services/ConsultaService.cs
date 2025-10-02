using CliniData.Api.DTOs;
using CliniData.Api.Models;
using CliniData.Api.Repositories;

namespace CliniData.Api.Services
{
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

        private static ConsultaDto ConverterParaDto(Consulta c) => new()
        {
            IdConsulta = c.IdConsulta,
            DataHora = c.DataHora,
            PacienteId = c.PacienteId,
            MedicoId = c.MedicoId,
            InstituicaoId = c.InstituicaoId,
            Observacao = c.Observacao
        };
        private static Consulta ConverterParaEntidade(CriarConsultaDto dto) => new()
        {
            DataHora = dto.DataHora,
            PacienteId = dto.PacienteId,
            MedicoId = dto.MedicoId,
            InstituicaoId = dto.InstituicaoId,
            Observacao = dto.Observacao
        };
        private static void AtualizarEntidadeDoDto(Consulta c, CriarConsultaDto dto)
        {
            c.DataHora = dto.DataHora;
            c.PacienteId = dto.PacienteId;
            c.MedicoId = dto.MedicoId;
            c.InstituicaoId = dto.InstituicaoId;
            c.Observacao = dto.Observacao;
        }
    }
}