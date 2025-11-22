using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using CliniData.Api.DTOs;
using CliniData.Api.Services;

namespace CliniData.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ConsultasController : ControllerBase
    {
        private readonly IConsultaService _service;
        private readonly UsuarioAtualService _usuarioAtual;
        private readonly ILogger<ConsultasController> _logger;

        public ConsultasController(
            IConsultaService service,
            UsuarioAtualService usuarioAtual,
            ILogger<ConsultasController> logger)
        {
            _service = service;
            _usuarioAtual = usuarioAtual;
            _logger = logger;
        }

        private string? GetRole() =>
            User.FindFirstValue(ClaimTypes.Role);

        // ============================================================
        // GET → Buscar todas
        // ============================================================
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ConsultaDto>>> BuscarTodas()
        {
            try
            {
                var role = GetRole();

                return role switch
                {
                    "Medico" => Ok(await _service.BuscarTodasDoMedicoAtualAsync()),
                    "Paciente" => Ok(await _service.BuscarTodasDoPacienteAtualAsync()),
                    _ => Unauthorized("Papel desconhecido.")
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao buscar consultas");
                return StatusCode(500, "Erro ao buscar consultas.");
            }
        }

        // ============================================================
        // GET → Buscar por ID
        // ============================================================
        [HttpGet("{id}")]
        public async Task<ActionResult<ConsultaDto>> BuscarPorId(int id)
        {
            var consulta = await _service.BuscarPorIdAsync(id);
            if (consulta == null)
                return NotFound("Consulta não encontrada.");

            return Ok(consulta);
        }

        // ============================================================
        // POST → Criar
        // ============================================================
        [HttpPost]
        [Authorize(Roles = "Medico")]
        public async Task<ActionResult<ConsultaDto>> Criar([FromBody] CriarConsultaDto dto)
        {
            try
            {
                var consulta = await _service.CriarAsync(dto);
                return CreatedAtAction(nameof(BuscarPorId), new { id = consulta.IdConsulta }, consulta);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // ============================================================
        // PUT → Atualizar
        // ============================================================
        [HttpPut("{id}")]
        [Authorize(Roles = "Medico")]
        public async Task<ActionResult<ConsultaDto>> Atualizar(int id, [FromBody] EditarConsultaDto dto)
        {
            try
            {
                var result = await _service.AtualizarAsync(id, dto);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // ============================================================
        // DELETE → Remover
        // ============================================================
        [HttpDelete("{id}")]
        [Authorize(Roles = "Medico")]
        public async Task<ActionResult> Remover(int id)
        {
            try
            {
                await _service.RemoverAsync(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // ============================================================
        // DEBUG ENDPOINTS
        // ============================================================
        [HttpGet("claims")]
        public IActionResult Claims()
        {
            return Ok(User.Claims.Select(c => new { c.Type, c.Value }));
        }
    }
}
