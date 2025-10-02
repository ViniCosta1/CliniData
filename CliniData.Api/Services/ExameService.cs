using CliniData.Api.DTOs;
using CliniData.Api.Models;
using CliniData.Api.Repositories;

namespace CliniData.Api.Services
{
    public class ExameService : IExameService
    {
        private readonly IExameRepository _repositorio;
        private readonly ILogger<ExameService> _logger;

        public ExameService(IExameRepository repositorio, ILogger<ExameService> logger)
        {
            _repositorio = repositorio;
            _logger = logger;
        }

        public async Task<IEnumerable<ExameDto>> BuscarTodosAsync()
        {
            var exames = await _repositorio.BuscarTodosAsync();
            return exames.Select(ConverterParaDto);
        }

        public async Task<ExameDto> BuscarPorIdAsync(int id)
        {
            var exame = await _repositorio.BuscarPorIdAsync(id)
                         ?? throw new Exception($"Exame com ID {id} não encontrado");
            return ConverterParaDto(exame);
        }

        public async Task<ExameDto> CriarAsync(CriarExameDto dto)
        {
            var exame = ConverterParaEntidade(dto);
            var criado = await _repositorio.CriarAsync(exame);
            return ConverterParaDto(criado);
        }

        public async Task<ExameDto> AtualizarAsync(int id, CriarExameDto dto)
        {
            var existente = await _repositorio.BuscarPorIdAsync(id)
                           ?? throw new Exception($"Exame com ID {id} não encontrado");
            AtualizarEntidadeDoDto(existente, dto);
            var atualizado = await _repositorio.AtualizarAsync(existente);
            return ConverterParaDto(atualizado);
        }

        public async Task RemoverAsync(int id)
        {
            if (!await _repositorio.ExisteAsync(id))
                throw new Exception($"Exame com ID {id} não encontrado");
            await _repositorio.RemoverAsync(id);
        }

        private static ExameDto ConverterParaDto(Exame e) => new()
        {
            IdExame = e.IdExame,
            TipoExame = e.TipoExame,
            DataHora = e.DataHora,
            PacienteId = e.PacienteId,
            MedicoId = e.MedicoId,
            InstituicaoId = e.InstituicaoId,
            Resultado = e.Resultado,
            Observacao = e.Observacao
        };
        private static Exame ConverterParaEntidade(CriarExameDto dto) => new()
        {
            TipoExame = dto.TipoExame,
            DataHora = dto.DataHora,
            PacienteId = dto.PacienteId,
            MedicoId = dto.MedicoId,
            InstituicaoId = dto.InstituicaoId,
            Resultado = dto.Resultado,
            Observacao = dto.Observacao
        };
        private static void AtualizarEntidadeDoDto(Exame e, CriarExameDto dto)
        {
            e.TipoExame = dto.TipoExame;
            e.DataHora = dto.DataHora;
            e.PacienteId = dto.PacienteId;
            e.MedicoId = dto.MedicoId;
            e.InstituicaoId = dto.InstituicaoId;
            e.Resultado = dto.Resultado;
            e.Observacao = dto.Observacao;
        }
    }
}