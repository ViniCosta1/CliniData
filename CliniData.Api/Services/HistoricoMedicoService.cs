using CliniData.Api.DTOs;
using CliniData.Api.Models;
using CliniData.Api.Repositories;

namespace CliniData.Api.Services
{
    public class HistoricoMedicoService : IHistoricoMedicoService
    {
        private readonly IHistoricoMedicoRepository _repositorio;
        private readonly ILogger<HistoricoMedicoService> _logger;

        public HistoricoMedicoService(IHistoricoMedicoRepository repositorio, ILogger<HistoricoMedicoService> logger)
        {
            _repositorio = repositorio;
            _logger = logger;
        }

        public async Task<IEnumerable<HistoricoMedicoDto>> BuscarTodosAsync()
        {
            var historicos = await _repositorio.BuscarTodosAsync();
            return historicos.Select(ConverterParaDto);
        }

        public async Task<IEnumerable<HistoricoMedicoDto>> BuscarPorPacienteAsync(int pacienteId)
        {
            var historicos = await _repositorio.BuscarPorPacienteAsync(pacienteId);
            return historicos.Select(ConverterParaDto);
        }

        public async Task<HistoricoMedicoDto> BuscarPorIdAsync(int id)
        {
            var historico = await _repositorio.BuscarPorIdAsync(id)
                ?? throw new Exception($"Histórico médico com ID {id} não encontrado");
            return ConverterParaDto(historico);
        }

        public async Task<HistoricoMedicoDto> CriarAsync(CriarHistoricoMedicoDto dto)
        {
            var historico = ConverterParaEntidade(dto);
            var criado = await _repositorio.CriarAsync(historico);
            return ConverterParaDto(criado);
        }

        public async Task<HistoricoMedicoDto> AtualizarAsync(int id, CriarHistoricoMedicoDto dto)
        {
            var existente = await _repositorio.BuscarPorIdAsync(id)
                ?? throw new Exception($"Histórico médico com ID {id} não encontrado");
            AtualizarEntidadeDoDto(existente, dto);
            var atualizado = await _repositorio.AtualizarAsync(existente);
            return ConverterParaDto(atualizado);
        }

        public async Task RemoverAsync(int id)
        {
            if (!await _repositorio.ExisteAsync(id))
                throw new Exception($"Histórico médico com ID {id} não encontrado");
            await _repositorio.RemoverAsync(id);
        }

        private static HistoricoMedicoDto ConverterParaDto(HistoricoMedico h) => new()
        {
            IdHistorico = h.IdHistorico,
            PacienteId = h.PacienteId,
            DataRegistro = h.DataRegistro,
            Diagnostico = h.Diagnostico,
            Tratamento = h.Tratamento,
            Observacao = h.Observacao
        };
        private static HistoricoMedico ConverterParaEntidade(CriarHistoricoMedicoDto dto) => new()
        {
            PacienteId = dto.PacienteId,
            DataRegistro = dto.DataRegistro == DateTime.MinValue ? DateTime.Now : dto.DataRegistro,
            Diagnostico = dto.Diagnostico,
            Tratamento = dto.Tratamento,
            Observacao = dto.Observacao
        };
        private static void AtualizarEntidadeDoDto(HistoricoMedico h, CriarHistoricoMedicoDto dto)
        {
            h.PacienteId = dto.PacienteId;
            h.DataRegistro = dto.DataRegistro == DateTime.MinValue ? DateTime.Now : dto.DataRegistro;
            h.Diagnostico = dto.Diagnostico;
            h.Tratamento = dto.Tratamento;
            h.Observacao = dto.Observacao;
        }
    }
}