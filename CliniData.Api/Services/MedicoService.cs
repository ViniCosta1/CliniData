using CliniData.Api.Controllers;
using CliniData.Api.DTOs;
using CliniData.Api.Repositories;
using CliniData.Domain.Entities;
using CliniData.Domain.ValueObjects;
using Microsoft.Extensions.Logging;

namespace CliniData.Api.Services
{
    public class MedicoService : IMedicoService
    {
        private readonly IMedicoRepository _repositorio;
        private readonly ILogger<MedicoService> _logger;
        private readonly IUsuarioAtualService _usuarioAtual; // ADICIONADO

        public MedicoService(
            IMedicoRepository repositorio,
            ILogger<MedicoService> logger,
            IUsuarioAtualService usuarioAtual) // ADICIONADO
        {
            _repositorio = repositorio;
            _logger = logger;
            _usuarioAtual = usuarioAtual;
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

        public async Task<MedicoDto> CriarAsync(CriarMedicoDto dto)
        {
            if (await _repositorio.CrmExisteAsync(dto.CRM))
                throw new Exception("Já existe médico com este CRM");

            var medico = Medico.Criar(
                nome: dto.Nome,
                crm: new CRM(dto.CRM),
                especialidadeMedicaId: dto.EspecialidadeMedicaId,
                telefone: dto.Telefone,
                email: new Email(dto.Email)
                );

            var criado = await _repositorio.CriarAsync(medico);
            return ConverterParaDto(criado);
        }

        public async Task<MedicoDto> AtualizarAsync(int id, CriarMedicoDto dto)
        {
            var existente = await _repositorio.BuscarPorIdAsync(id)
                           ?? throw new Exception($"Médico com ID {id} não encontrado");

            if (await _repositorio.CrmExisteAsync(dto.CRM, id))
                throw new Exception("Já existe outro médico com este CRM");

            existente.Atualizar(
                nome: dto.Nome,
                crm: new CRM(dto.CRM),
                especialidadeMedicaId: dto.EspecialidadeMedicaId,
                telefone: dto.Telefone,
                email: new Email(dto.Email)
            );

            var atualizado = await _repositorio.AtualizarAsync(existente);
            return ConverterParaDto(atualizado);
        }

        public async Task RemoverAsync(int id)
        {
            if (!await _repositorio.ExisteAsync(id))
                throw new Exception($"Médico com ID {id} não encontrado");

            await _repositorio.RemoverAsync(id);
        }

        public async Task<IEnumerable<InstituicaoDto>> BuscarInstituicoesDoMedicoAtualAsync()
        {
            var userIdString = _usuarioAtual.ObterUsuarioId();
            if (!int.TryParse(userIdString, out int userId))
                return Enumerable.Empty<InstituicaoDto>();

            var medico = await _repositorio.FindByUserIdAsync(userId);
            if (medico == null)
                return Enumerable.Empty<InstituicaoDto>();

            var instituicoes = await _repositorio.BuscarInstituicoesDoMedicoAsync(medico.Id);

            return instituicoes.Select(i => new InstituicaoDto
            {
                IdInstituicao = i.Id,
                Nome = i.Nome,
                Email = i.Email,
                CNPJ = i.Cnpj,
                Telefone = i.Telefone,
                Rua = i.Rua,
                Numero = i.Numero,
                Bairro = i.Bairro,
                Cidade = i.Cidade,
                Estado = i.Estado,
                CEP = i.Cep
            });
        }
        private static MedicoDto ConverterParaDto(Medico medico) => new()
        {
            IdMedico = medico.Id,
            Nome = medico.Nome,
            CRM = medico.CRM.Valor,
            EspecialidadeMedicaId = medico.EspecialidadeMedicaId,
            Telefone = medico.Telefone,
            Email = medico.Email.Valor
        };
    }
}
