using CliniData.Api.DTOs;
using CliniData.Api.Models;
using CliniData.Api.Repositories;

namespace CliniData.Api.Services
{
    public class MedicoService : IMedicoService
    {
        private readonly IMedicoRepository _repositorio;
        private readonly ILogger<MedicoService> _logger;

        public MedicoService(IMedicoRepository repositorio, ILogger<MedicoService> logger)
        {
            _repositorio = repositorio;
            _logger = logger;
        }

        public async Task<IEnumerable<MedicoDto>> BuscarTodosAsync()
        {
            var medicos = await _repositorio.BuscarTodosAsync();
            return medicos.Select(ConverterParaDto);
        }

        public async Task<MedicoDto> BuscarPorIdAsync(int id)
        {
            var medico = await _repositorio.BuscarPorIdAsync(id)
                          ?? throw new Exception($"Médico com ID {id} não encontrado");
            return ConverterParaDto(medico);
        }

        public async Task<MedicoDto> BuscarPorCrmAsync(string crm)
        {
            var medico = await _repositorio.BuscarPorCrmAsync(crm)
                          ?? throw new Exception($"Médico com CRM {crm} não encontrado");
            return ConverterParaDto(medico);
        }

        public async Task<MedicoDto> CriarAsync(CriarMedicoDto criarDto)
        {
            if (await _repositorio.CrmExisteAsync(criarDto.CRM))
                throw new Exception("Já existe médico com este CRM");

            var medico = ConverterParaEntidade(criarDto);
            var criado = await _repositorio.CriarAsync(medico);
            return ConverterParaDto(criado);
        }

        public async Task<MedicoDto> AtualizarAsync(int id, CriarMedicoDto atualizarDto)
        {
            var existente = await _repositorio.BuscarPorIdAsync(id)
                           ?? throw new Exception($"Médico com ID {id} não encontrado");
            if (await _repositorio.CrmExisteAsync(atualizarDto.CRM, id))
                throw new Exception("Já existe outro médico com este CRM");

            AtualizarEntidadeDoDto(existente, atualizarDto);
            var atualizado = await _repositorio.AtualizarAsync(existente);
            return ConverterParaDto(atualizado);
        }

        public async Task RemoverAsync(int id)
        {
            if (!await _repositorio.ExisteAsync(id))
                throw new Exception($"Médico com ID {id} não encontrado");
            await _repositorio.RemoverAsync(id);
        }

        private static MedicoDto ConverterParaDto(Medico medico) => new()
        {
            IdMedico = medico.IdMedico,
            Nome = medico.Nome,
            CRM = medico.CRM,
            Especialidade = medico.Especialidade,
            Telefone = medico.Telefone,
            Email = medico.Email
        };

        private static Medico ConverterParaEntidade(CriarMedicoDto dto) => new()
        {
            Nome = dto.Nome,
            CRM = dto.CRM,
            Especialidade = dto.Especialidade,
            Telefone = dto.Telefone,
            Email = dto.Email
        };

        private static void AtualizarEntidadeDoDto(Medico medico, CriarMedicoDto dto)
        {
            medico.Nome = dto.Nome;
            medico.CRM = dto.CRM;
            medico.Especialidade = dto.Especialidade;
            medico.Telefone = dto.Telefone;
            medico.Email = dto.Email;
        }
    }
}