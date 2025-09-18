using Microsoft.AspNetCore.Mvc;
using CliniData.Api.DTOs;
using CliniData.Api.Services;

namespace CliniData.Api.Controllers
{
    /// <summary>
    /// Controller para gerenciar pacientes
    /// Endpoints da API REST para operações com pacientes
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class PacientesController : ControllerBase
    {
        private readonly IPacienteService _pacienteService;
        private readonly ILogger<PacientesController> _logger;

        public PacientesController(IPacienteService pacienteService, ILogger<PacientesController> logger)
        {
            _pacienteService = pacienteService;
            _logger = logger;
        }

        /// <summary>
        /// Lista todos os pacientes cadastrados
        /// </summary>
        /// <returns>Lista de pacientes</returns>
        /// <response code="200">Retorna a lista de pacientes</response>
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<PacienteDto>>> BuscarTodosPacientes()
        {
            try
            {
                var pacientes = await _pacienteService.BuscarTodosAsync();
                return Ok(pacientes);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao buscar pacientes");
                return StatusCode(500, "Erro interno do servidor");
            }
        }

        /// <summary>
        /// Busca um paciente pelo ID
        /// </summary>
        /// <param name="id">ID do paciente</param>
        /// <returns>Dados do paciente</returns>
        /// <response code="200">Retorna o paciente encontrado</response>
        /// <response code="404">Paciente não encontrado</response>
        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<PacienteDto>> BuscarPacientePorId(int id)
        {
            try
            {
                var paciente = await _pacienteService.BuscarPorIdAsync(id);
                return Ok(paciente);
            }
            catch (RecursoNaoEncontradoException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao buscar paciente por ID: {Id}", id);
                return StatusCode(500, "Erro interno do servidor");
            }
        }

        /// <summary>
        /// Busca um paciente pelo CPF
        /// </summary>
        /// <param name="cpf">CPF do paciente</param>
        /// <returns>Dados do paciente</returns>
        /// <response code="200">Retorna o paciente encontrado</response>
        /// <response code="404">Paciente não encontrado</response>
        [HttpGet("cpf/{cpf}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<PacienteDto>> BuscarPacientePorCpf(string cpf)
        {
            try
            {
                var paciente = await _pacienteService.BuscarPorCpfAsync(cpf);
                return Ok(paciente);
            }
            catch (RecursoNaoEncontradoException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao buscar paciente por CPF: {CPF}", cpf);
                return StatusCode(500, "Erro interno do servidor");
            }
        }

        /// <summary>
        /// Cria um novo paciente
        /// </summary>
        /// <param name="criarDto">Dados do paciente</param>
        /// <returns>Paciente criado</returns>
        /// <response code="201">Paciente criado com sucesso</response>
        /// <response code="400">Dados inválidos ou CPF já cadastrado</response>
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<PacienteDto>> CriarPaciente([FromBody] CriarPacienteDto criarDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var pacienteCriado = await _pacienteService.CriarAsync(criarDto);
                return CreatedAtAction(
                    nameof(BuscarPacientePorId),
                    new { id = pacienteCriado.IdPaciente },
                    pacienteCriado);
            }
            catch (RegraDeNegocioException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao criar paciente");
                return StatusCode(500, "Erro interno do servidor");
            }
        }

        /// <summary>
        /// Atualiza um paciente existente
        /// </summary>
        /// <param name="id">ID do paciente</param>
        /// <param name="atualizarDto">Novos dados do paciente</param>
        /// <returns>Paciente atualizado</returns>
        /// <response code="200">Paciente atualizado com sucesso</response>
        /// <response code="400">Dados inválidos</response>
        /// <response code="404">Paciente não encontrado</response>
        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<PacienteDto>> AtualizarPaciente(int id, [FromBody] CriarPacienteDto atualizarDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var pacienteAtualizado = await _pacienteService.AtualizarAsync(id, atualizarDto);
                return Ok(pacienteAtualizado);
            }
            catch (RecursoNaoEncontradoException ex)
            {
                return NotFound(ex.Message);
            }
            catch (RegraDeNegocioException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao atualizar paciente: {Id}", id);
                return StatusCode(500, "Erro interno do servidor");
            }
        }

        /// <summary>
        /// Remove um paciente
        /// </summary>
        /// <param name="id">ID do paciente</param>
        /// <returns>Confirmação da remoção</returns>
        /// <response code="204">Paciente removido com sucesso</response>
        /// <response code="404">Paciente não encontrado</response>
        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult> RemoverPaciente(int id)
        {
            try
            {
                await _pacienteService.RemoverAsync(id);
                return NoContent();
            }
            catch (RecursoNaoEncontradoException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao remover paciente: {Id}", id);
                return StatusCode(500, "Erro interno do servidor");
            }
        }
    }
}