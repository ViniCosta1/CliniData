using CliniData.Api.DTOs;
using CliniData.Api.Models;
using CliniData.Api.Repositories;

namespace CliniData.Api.Services
{
    public class InstituicaoService : IInstituicaoService
    {
        private readonly IInstituicaoRepository _repositorio;
        private readonly ILogger<InstituicaoService> _logger;

        public InstituicaoService(IInstituicaoRepository repositorio, ILogger<InstituicaoService> logger)
        {
            _repositorio = repositorio;
            _logger = logger;
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

            var instituicao = ConverterParaEntidade(dto);
            var criada = await _repositorio.CriarAsync(instituicao);
            return ConverterParaDto(criada);
        }

        public async Task<InstituicaoDto> AtualizarAsync(int id, CriarInstituicaoDto dto)
        {
            var existente = await _repositorio.BuscarPorIdAsync(id)
                ?? throw new Exception($"Instituição com ID {id} não encontrada");
            if (await _repositorio.CnpjExisteAsync(dto.CNPJ, id))
                throw new Exception("Já existe outra instituição com este CNPJ");

            AtualizarEntidadeDoDto(existente, dto);
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
            IdInstituicao = i.IdInstituicao,
            Nome = i.Nome,
            CNPJ = i.CNPJ,
            Telefone = i.Telefone,
            Rua = i.Rua,
            Numero = i.Numero,
            Bairro = i.Bairro,
            Cidade = i.Cidade,
            Estado = i.Estado,
            CEP = i.CEP
        };

        private static Instituicao ConverterParaEntidade(CriarInstituicaoDto dto) => new()
        {
            Nome = dto.Nome,
            CNPJ = dto.CNPJ,
            Telefone = dto.Telefone,
            Rua = dto.Rua,
            Numero = dto.Numero,
            Bairro = dto.Bairro,
            Cidade = dto.Cidade,
            Estado = dto.Estado,
            CEP = dto.CEP
        };

        private static void AtualizarEntidadeDoDto(Instituicao i, CriarInstituicaoDto dto)
        {
            i.Nome = dto.Nome;
            i.CNPJ = dto.CNPJ;
            i.Telefone = dto.Telefone;
            i.Rua = dto.Rua;
            i.Numero = dto.Numero;
            i.Bairro = dto.Bairro;
            i.Cidade = dto.Cidade;
            i.Estado = dto.Estado;
            i.CEP = dto.CEP;
        }
    }
}