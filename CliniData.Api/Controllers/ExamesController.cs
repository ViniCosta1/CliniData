using Microsoft.AspNetCore.Mvc;
using CliniData.Api.DTOs;
using CliniData.Api.Services;

namespace CliniData.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ExamesController : ControllerBase
    {
        private readonly IExameService _service;
        private readonly ILogger<ExamesController> _logger;

        public ExamesController(IExameService service, ILogger<ExamesController> logger)
        {
            _service = service;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ExameDto>>> BuscarTodos()
        {
            var exames = await _service.BuscarTodosAsync();
            return Ok(exames);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ExameDto>> BuscarPorId(int id)
        {
            try
            {
                var exame = await _service.BuscarPorIdAsync(id);
                return Ok(exame);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao buscar exame por ID");
                return NotFound(ex.Message);
            }
        }

        [HttpPost]
        public async Task<ActionResult<ExameDto>> Criar([FromBody] CriarExameDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            try
            {
                var exame = await _service.CriarAsync(dto);
                return CreatedAtAction(nameof(BuscarPorId), new { id = exame.IdExame }, exame);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao criar exame");
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ExameDto>> Atualizar(int id, [FromBody] CriarExameDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            try
            {
                var exame = await _service.AtualizarAsync(id, dto);
                return Ok(exame);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao atualizar exame");
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
                _logger.LogError(ex, "Erro ao remover exame");
                return NotFound(ex.Message);
            }
        }
    }
}