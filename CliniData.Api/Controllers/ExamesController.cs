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

        [HttpGet("{id}/arquivo")]
        public async Task<IActionResult> BaixarArquivo(int id)
        {
            var exame = await _service.BuscarPorIdAsync(id);

            if (exame == null)
                return NotFound("Exame não encontrado.");

            if (exame.DocumentoExame == null || exame.DocumentoExame.Length == 0)
                return NotFound("Este exame não possui arquivo anexado.");

            // Definir tipo genérico (se quiser detectar por extensão depois, posso ajustar)
            var contentType = "application/octet-stream";

            // Nome sugerido para o arquivo baixado
            var fileName = $"exame_{exame.IdExame}.pdf";

            return File(exame.DocumentoExame, contentType, fileName);
        }


        [HttpPost]
        [Consumes("multipart/form-data")]
        public async Task<ActionResult<ExameDto>> Criar([FromForm] CriarExameFormDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            try
            {
                var exame = await _service.CriarComArquivoAsync(dto);
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