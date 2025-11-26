using CliniData.Api.DTOs;
using CliniData.Api.Repositories;
using CliniData.Domain.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System.Security.Claims;

namespace CliniData.Api.Services
{
    public class InstituicaoService : IInstituicaoService
    {
        private readonly IInstituicaoRepository _repositorio;
        private readonly ILogger<InstituicaoService> _logger;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public InstituicaoService(
            IInstituicaoRepository repositorio,
            ILogger<InstituicaoService> logger,
            IHttpContextAccessor httpContextAccessor)
        {
            _repositorio = repositorio;
            _logger = logger;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<IEnumerable<InstituicaoDto>> BuscarTodasAsync()
        {
            var instituicoes = await _repositorio.BuscarTodasAsync();
            return instituicoes.Select(ConverterParaDto);
        }

        public async Task<InstituicaoDto> BuscarPorIdAsync(int id)
        {
            var instituicao = await _repositorio.BuscarPorIdAsync(id)
                ?? throw new Exception($"Instituição com ID {id} não encontrada");
            return ConverterParaDto(instituicao);
        }

        public async Task<InstituicaoDto> BuscarPorCnpjAsync(string cnpj)
        {
            var instituicao = await _repositorio.BuscarPorCnpjAsync(cnpj)
                ?? throw new Exception($"Instituição com CNPJ {cnpj} não encontrada");
            return ConverterParaDto(instituicao);
        }

        public async Task<InstituicaoDto> CriarAsync(CriarInstituicaoDto dto)
        {
            if (await _repositorio.CnpjExisteAsync(dto.CNPJ))
                throw new Exception("Já existe instituição com este CNPJ");


            var instituicao = new Instituicao(
                nome: dto.Nome,
                cnpj: dto.CNPJ,
                telefone: dto.Telefone,
                email: dto.Email,
                rua: dto.Rua,
                numero: dto.Numero,
                bairro: dto.Bairro,
                cidade: dto.Cidade,
                estado: dto.Estado,
                cep: dto.CEP
            );

            var criada = await _repositorio.CriarAsync(instituicao);
            return ConverterParaDto(criada);
        }

        public async Task<InstituicaoDto> AtualizarAsync(int id, CriarInstituicaoDto dto)
        {
            var existente = await _repositorio.BuscarPorIdAsync(id)
                ?? throw new Exception($"Instituição com ID {id} não encontrada");

            if (await _repositorio.CnpjExisteAsync(dto.CNPJ, id))
                throw new Exception("Já existe outra instituição com este CNPJ");

            existente.Atualizar(
                nome: dto.Nome,
                telefone: dto.Telefone,
                email: dto.Email,
                rua: dto.Rua,
                numero: dto.Numero,
                bairro: dto.Bairro,
                cidade: dto.Cidade,
                estado: dto.Estado,
                cep: dto.CEP
            );

            var atualizada = await _repositorio.AtualizarAsync(existente);
            return ConverterParaDto(atualizada);
        }

        public async Task RemoverAsync(int id)
        {
            if (!await _repositorio.ExisteAsync(id))
                throw new Exception($"Instituição com ID {id} não encontrada");
            await _repositorio.RemoverAsync(id);
        }

        private static InstituicaoDto ConverterParaDto(Instituicao i) => new()
        {
            IdInstituicao = i.Id,
            Nome = i.Nome,
            CNPJ = i.Cnpj,
            Telefone = i.Telefone,
            Rua = i.Rua,
            Numero = i.Numero,
            Bairro = i.Bairro,
            Cidade = i.Cidade,
            Estado = i.Estado,
            CEP = i.Cep
        };
    }
}
