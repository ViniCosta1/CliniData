using CliniData.Api.DTOs;
using CliniData.Api.Models;
using CliniData.Api.Repositories;

namespace CliniData.Api.Services
{
    /// <summary>
    /// Implementação do serviço de pacientes
    /// Contém a lógica de negócio e validações
    /// </summary>
    public class PacienteService : IPacienteService
    {
        private readonly IPacienteRepository _repositorio;
        private readonly ILogger<PacienteService> _logger;

        public PacienteService(IPacienteRepository repositorio, ILogger<PacienteService> logger)
        {
            _repositorio = repositorio;
            _logger = logger;
        }

        /// <summary>
        /// Busca todos os pacientes
        /// </summary>
        public async Task<IEnumerable<PacienteDto>> BuscarTodosAsync()
        {
            _logger.LogInformation("Buscando todos os pacientes");

            var pacientes = await _repositorio.BuscarTodosAsync();
            return pacientes.Select(ConverterParaDto);
        }

        /// <summary>
        /// Busca paciente por ID
        /// </summary>
        public async Task<PacienteDto> BuscarPorIdAsync(int id)
        {
            _logger.LogInformation("Buscando paciente por ID: {Id}", id);

            var paciente = await _repositorio.BuscarPorIdAsync(id);

            if (paciente == null)
            {
                throw new RecursoNaoEncontradoException($"Paciente com ID {id} não encontrado");
            }

            return ConverterParaDto(paciente);
        }

        /// <summary>
        /// Busca paciente por CPF
        /// </summary>
        public async Task<PacienteDto> BuscarPorCpfAsync(string cpf)
        {
            _logger.LogInformation("Buscando paciente por CPF: {CPF}", cpf);

            var paciente = await _repositorio.BuscarPorCpfAsync(cpf);

            if (paciente == null)
            {
                throw new RecursoNaoEncontradoException($"Paciente com CPF {cpf} não encontrado");
            }

            return ConverterParaDto(paciente);
        }

        /// <summary>
        /// Cria um novo paciente
        /// </summary>
        public async Task<PacienteDto> CriarAsync(CriarPacienteDto criarDto)
        {
            _logger.LogInformation("Criando novo paciente: {Nome}", criarDto.Nome);

            // Validar se CPF já existe
            if (await _repositorio.CpfExisteAsync(criarDto.CPF))
            {
                throw new RegraDeNegocioException("Já existe um paciente cadastrado com este CPF");
            }

            var paciente = ConverterParaEntidade(criarDto);
            var pacienteCriado = await _repositorio.CriarAsync(paciente);

            _logger.LogInformation("Paciente criado com sucesso. ID: {Id}", pacienteCriado.IdPaciente);

            return ConverterParaDto(pacienteCriado);
        }

        /// <summary>
        /// Atualiza um paciente existente
        /// </summary>
        public async Task<PacienteDto> AtualizarAsync(int id, CriarPacienteDto atualizarDto)
        {
            _logger.LogInformation("Atualizando paciente ID: {Id}", id);

            var pacienteExistente = await _repositorio.BuscarPorIdAsync(id);
            if (pacienteExistente == null)
            {
                throw new RecursoNaoEncontradoException($"Paciente com ID {id} não encontrado");
            }

            // Validar se CPF já existe para outro paciente
            if (await _repositorio.CpfExisteAsync(atualizarDto.CPF, id))
            {
                throw new RegraDeNegocioException("Já existe outro paciente cadastrado com este CPF");
            }

            // Atualizar dados
            AtualizarEntidadeDoDto(pacienteExistente, atualizarDto);
            var pacienteAtualizado = await _repositorio.AtualizarAsync(pacienteExistente);

            _logger.LogInformation("Paciente atualizado com sucesso. ID: {Id}", pacienteAtualizado.IdPaciente);

            return ConverterParaDto(pacienteAtualizado);
        }

        /// <summary>
        /// Remove um paciente
        /// </summary>
        public async Task RemoverAsync(int id)
        {
            _logger.LogInformation("Removendo paciente ID: {Id}", id);

            if (!await _repositorio.ExisteAsync(id))
            {
                throw new RecursoNaoEncontradoException($"Paciente com ID {id} não encontrado");
            }

            await _repositorio.RemoverAsync(id);

            _logger.LogInformation("Paciente removido com sucesso. ID: {Id}", id);
        }

        #region Métodos de Mapeamento

        /// <summary>
        /// Converte Paciente para PacienteDto
        /// </summary>
        private static PacienteDto ConverterParaDto(Paciente paciente)
        {
            return new PacienteDto
            {
                IdPaciente = paciente.IdPaciente,
                Nome = paciente.Nome,
                DataNascimento = paciente.DataNascimento,
                Sexo = paciente.Sexo,
                CPF = paciente.CPF,
                Telefone = paciente.Telefone,
                Email = paciente.Email,
                Rua = paciente.Rua,
                Numero = paciente.Numero,
                Complemento = paciente.Complemento,
                Bairro = paciente.Bairro,
                Cidade = paciente.Cidade,
                Estado = paciente.Estado,
                CEP = paciente.CEP
            };
        }

        /// <summary>
        /// Converte CriarPacienteDto para Paciente
        /// </summary>
        private static Paciente ConverterParaEntidade(CriarPacienteDto dto)
        {
            return new Paciente
            {
                Nome = dto.Nome,
                DataNascimento = dto.DataNascimento,
                Sexo = dto.Sexo,
                CPF = dto.CPF,
                Telefone = dto.Telefone,
                Email = dto.Email,
                Rua = dto.Rua,
                Numero = dto.Numero,
                Complemento = dto.Complemento,
                Bairro = dto.Bairro,
                Cidade = dto.Cidade,
                Estado = dto.Estado,
                CEP = dto.CEP
            };
        }

        /// <summary>
        /// Atualiza Paciente a partir de CriarPacienteDto
        /// </summary>
        private static void AtualizarEntidadeDoDto(Paciente paciente, CriarPacienteDto dto)
        {
            paciente.Nome = dto.Nome;
            paciente.DataNascimento = dto.DataNascimento;
            paciente.Sexo = dto.Sexo;
            paciente.CPF = dto.CPF;
            paciente.Telefone = dto.Telefone;
            paciente.Email = dto.Email;
            paciente.Rua = dto.Rua;
            paciente.Numero = dto.Numero;
            paciente.Complemento = dto.Complemento;
            paciente.Bairro = dto.Bairro;
            paciente.Cidade = dto.Cidade;
            paciente.Estado = dto.Estado;
            paciente.CEP = dto.CEP;
        }

        #endregion
    }

    #region Exceções Customizadas

    /// <summary>
    /// Exceção para quando um recurso não é encontrado
    /// </summary>
    public class RecursoNaoEncontradoException : Exception
    {
        public RecursoNaoEncontradoException(string mensagem) : base(mensagem) { }
    }

    /// <summary>
    /// Exceção para regras de negócio
    /// </summary>
    public class RegraDeNegocioException : Exception
    {
        public RegraDeNegocioException(string mensagem) : base(mensagem) { }
    }

    #endregion
}