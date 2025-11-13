using CliniData.Api.DTOs;
using CliniData.Domain.Entities;
using CliniData.Api.Repositories;
using CliniData.Domain.ValueObjects;
using CliniData.Domain.Enums;

namespace CliniData.Api.Services
{
    public class PacienteService : IPacienteService
    {
        private readonly IPacienteRepository _repositorio;
        private readonly ILogger<PacienteService> _logger;

        public PacienteService(IPacienteRepository repositorio, ILogger<PacienteService> logger)
        {
            _repositorio = repositorio;
            _logger = logger;
        }

        public async Task<IEnumerable<PacienteDto>> BuscarTodosAsync()
        {
            _logger.LogInformation("Buscando todos os pacientes");
            var pacientes = await _repositorio.BuscarTodosAsync();
            return pacientes.Select(ConverterParaDto);
        }

        public async Task<PacienteDto> BuscarPorIdAsync(int id)
        {
            _logger.LogInformation("Buscando paciente por ID: {Id}", id);
            var paciente = await _repositorio.BuscarPorIdAsync(id);

            if (paciente == null)
                throw new RecursoNaoEncontradoException($"Paciente com ID {id} não encontrado");

            return ConverterParaDto(paciente);
        }

        public async Task<PacienteDto> BuscarPorCpfAsync(string cpf)
        {
            _logger.LogInformation("Buscando paciente por CPF: {CPF}", cpf);

            var cpfVo = new CPF(cpf);
            var paciente = await _repositorio.BuscarPorCpfAsync(cpfVo.Valor);

            if (paciente == null)
                throw new RecursoNaoEncontradoException($"Paciente com CPF {cpf} não encontrado");

            return ConverterParaDto(paciente);
        }

        public async Task<PacienteDto> CriarAsync(CriarPacienteDto criarDto)
        {
            _logger.LogInformation("Criando novo paciente: {Nome}", criarDto.Nome);

            if (await _repositorio.CpfExisteAsync(criarDto.CPF))
                throw new RegraDeNegocioException("Já existe um paciente cadastrado com este CPF");

            var paciente = ConverterParaEntidade(criarDto);
            var pacienteCriado = await _repositorio.CriarAsync(paciente);

            _logger.LogInformation("Paciente criado com sucesso. ID: {Id}", pacienteCriado.Id);

            return ConverterParaDto(pacienteCriado);
        }

        public async Task<PacienteDto> AtualizarAsync(int id, CriarPacienteDto atualizarDto)
        {
            _logger.LogInformation("Atualizando paciente ID: {Id}", id);

            var pacienteExistente = await _repositorio.BuscarPorIdAsync(id);
            if (pacienteExistente == null)
                throw new RecursoNaoEncontradoException($"Paciente com ID {id} não encontrado");

            if (await _repositorio.CpfExisteAsync(atualizarDto.CPF, id))
                throw new RegraDeNegocioException("Já existe outro paciente cadastrado com este CPF");

            AtualizarEntidadeDoDto(pacienteExistente, atualizarDto);

            var pacienteAtualizado = await _repositorio.AtualizarAsync(pacienteExistente);
            _logger.LogInformation("Paciente atualizado com sucesso. ID: {Id}", pacienteAtualizado.Id);

            return ConverterParaDto(pacienteAtualizado);
        }

        public async Task RemoverAsync(int id)
        {
            _logger.LogInformation("Removendo paciente ID: {Id}", id);

            if (!await _repositorio.ExisteAsync(id))
                throw new RecursoNaoEncontradoException($"Paciente com ID {id} não encontrado");

            await _repositorio.RemoverAsync(id);
            _logger.LogInformation("Paciente removido com sucesso. ID: {Id}", id);
        }

        #region Métodos de Mapeamento

        private static PacienteDto ConverterParaDto(Paciente paciente)
        {
            return new PacienteDto
            {
                IdPaciente = paciente.Id,
                Nome = paciente.Nome,
                DataNascimento = paciente.DataNascimento,
                Sexo = paciente.Sexo.ToString(),
                CPF = paciente.CPF.Valor,
                Telefone = paciente.Telefone,
                Email = paciente.Email.Valor,
                Rua = paciente.Endereco?.Rua,
                Numero = paciente.Endereco?.Numero,
                Complemento = paciente.Endereco?.Complemento,
                Bairro = paciente.Endereco?.Bairro,
                Cidade = paciente.Endereco?.Cidade,
                Estado = paciente.Endereco?.UF,
                CEP = paciente.Endereco?.CEP
            };
        }

        private static Paciente ConverterParaEntidade(CriarPacienteDto dto)
        {
            var endereco = new Endereco
            {
                Rua = dto.Rua,
                Numero = dto.Numero,
                Complemento = dto.Complemento,
                Bairro = dto.Bairro,
                Cidade = dto.Cidade,
                UF = dto.Estado,
                CEP = dto.CEP
            };

            return Paciente.Criar(
                nome: dto.Nome,
                dataNascimento: dto.DataNascimento,
                sexo: Enum.Parse<Sexo>(dto.Sexo, ignoreCase: true),
                cpf: new CPF(dto.CPF),
                telefone: dto.Telefone,
                email: new Email(dto.Email),
                endereco: endereco
            );
        }


        private static void AtualizarEntidadeDoDto(Paciente paciente, CriarPacienteDto dto)
        {
            var endereco = new Endereco
            {
                Rua = dto.Rua,
                Numero = dto.Numero,
                Complemento = dto.Complemento,
                Bairro = dto.Bairro,
                Cidade = dto.Cidade,
                UF = dto.Estado,
                CEP = dto.CEP
            };

            paciente.AtualizarDados(
                nome: dto.Nome,
                dataNascimento: dto.DataNascimento,
                sexo: Enum.Parse<Sexo>(dto.Sexo, ignoreCase: true),
                cpf: new CPF(dto.CPF),
                telefone: dto.Telefone,
                email: new Email(dto.Email),
                endereco: endereco
            );
        }


        #endregion
    }

    public class RecursoNaoEncontradoException : Exception
    {
        public RecursoNaoEncontradoException(string mensagem) : base(mensagem) { }
    }

    public class RegraDeNegocioException : Exception
    {
        public RegraDeNegocioException(string mensagem) : base(mensagem) { }
    }
}
