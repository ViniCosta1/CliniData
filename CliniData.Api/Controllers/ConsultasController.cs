using Microsoft.AspNetCore.Mvc;
using CliniData.Api.DTOs;
using CliniData.Api.Services;

namespace CliniData.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ConsultasController : ControllerBase
    {
        private readonly IConsultaService _service;
        private readonly ILogger<ConsultasController> _logger;

        public ConsultasController(IConsultaService service, ILogger<ConsultasController> logger)
        {
            _service = service;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ConsultaDto>>> BuscarTodas()
        {
            var consultas = await _service.BuscarTodasAsync();
            return Ok(consultas);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ConsultaDto>> BuscarPorId(int id)
        {
            try
            {
                var consulta = await _service.BuscarPorIdAsync(id);
                return Ok(consulta);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao buscar consulta por ID");
                return NotFound(ex.Message);
            }
        }

        [HttpPost]
        public async Task<ActionResult<ConsultaDto>> Criar([FromBody] CriarConsultaDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            try
            {
                var consulta = await _service.CriarAsync(dto);
                return CreatedAtAction(nameof(BuscarPorId), new { id = consulta.IdConsulta }, consulta);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao criar consulta");
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ConsultaDto>> Atualizar(int id, [FromBody] CriarConsultaDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            try
            {
                var consulta = await _service.AtualizarAsync(id, dto);
                return Ok(consulta);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao atualizar consulta");
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
                _logger.LogError(ex, "Erro ao remover consulta");
                return NotFound(ex.Message);
            }
        }
    }
}