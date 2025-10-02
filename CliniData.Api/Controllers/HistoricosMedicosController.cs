using Microsoft.AspNetCore.Mvc;
using CliniData.Api.DTOs;
using CliniData.Api.Services;

namespace CliniData.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HistoricosMedicosController : ControllerBase
    {
        private readonly IHistoricoMedicoService _service;
        private readonly ILogger<HistoricosMedicosController> _logger;

        public HistoricosMedicosController(IHistoricoMedicoService service, ILogger<HistoricosMedicosController> logger)
        {
            _service = service;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<HistoricoMedicoDto>>> BuscarTodos()
        {
            var historicos = await _service.BuscarTodosAsync();
            return Ok(historicos);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<HistoricoMedicoDto>> BuscarPorId(int id)
        {
            try
            {
                var historico = await _service.BuscarPorIdAsync(id);
                return Ok(historico);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao buscar histórico médico por ID");
                return NotFound(ex.Message);
            }
        }

        [HttpGet("paciente/{pacienteId}")]
        public async Task<ActionResult<IEnumerable<HistoricoMedicoDto>>> BuscarPorPaciente(int pacienteId)
        {
            var historicos = await _service.BuscarPorPacienteAsync(pacienteId);
            return Ok(historicos);
        }

        [HttpPost]
        public async Task<ActionResult<HistoricoMedicoDto>> Criar([FromBody] CriarHistoricoMedicoDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            try
            {
                var historico = await _service.CriarAsync(dto);
                return CreatedAtAction(nameof(BuscarPorId), new { id = historico.IdHistorico }, historico);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao criar histórico médico");
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<HistoricoMedicoDto>> Atualizar(int id, [FromBody] CriarHistoricoMedicoDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            try
            {
                var historico = await _service.AtualizarAsync(id, dto);
                return Ok(historico);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao atualizar histórico médico");
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Remover(int id)
        {
            try
            {
                await _service.RemoverAsync(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao remover histórico médico");
                return NotFound(ex.Message);
            }
        }
    }
}