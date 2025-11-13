using CliniData.Api.DTOs;
using CliniData.Api.Repositories;
using CliniData.Domain.Entities;

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
            var historico = new HistoricoMedico
            {
                PacienteId = dto.PacienteId,
                MedicoId = dto.MedicoId,
                DataRegistro = dto.DataRegistro == DateTime.MinValue ? DateTime.UtcNow : dto.DataRegistro,
                Descricao = dto.Descricao
            };

            var criado = await _repositorio.CriarAsync(historico);
            return ConverterParaDto(criado);
        }

        public async Task<HistoricoMedicoDto> AtualizarAsync(int id, CriarHistoricoMedicoDto dto)
        {
            var existente = await _repositorio.BuscarPorIdAsync(id)
                ?? throw new Exception($"Histórico médico com ID {id} não encontrado");

            existente.PacienteId = dto.PacienteId;
            existente.MedicoId = dto.MedicoId;
            existente.DataRegistro = dto.DataRegistro == DateTime.MinValue ? DateTime.UtcNow : dto.DataRegistro;
            existente.Descricao = dto.Descricao;

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
            IdHistorico = h.Id,
            PacienteId = h.PacienteId,
            MedicoId = h.MedicoId,
            DataRegistro = h.DataRegistro,
            Descricao = h.Descricao
        };
    }
}
