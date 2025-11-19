using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using CliniData.Api.DTOs;
using CliniData.Api.Services;

namespace CliniData.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] // Protege todos os endpoints
    public class ConsultasController : ControllerBase
    {
        private readonly IConsultaService _service;
        private readonly ILogger<ConsultasController> _logger;

        public ConsultasController(IConsultaService service, ILogger<ConsultasController> logger)
        {
            _service = service;
            _logger = logger;
        }

        private int GetUserId() =>
            int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

        private string? GetUserRole() =>
            User.FindFirstValue(ClaimTypes.Role);

        private bool UsuarioEhAdmin() =>
            GetUserRole() == "Admin";

        private bool UsuarioEhPaciente() =>
            GetUserRole() == "Paciente";

        private bool UsuarioEhMedico() =>
            GetUserRole() == "Medico";

        // ============================================================
        // GET: Buscar todas as consultas
        // Médicos podem ver tudo
        // Pacientes só podem ver as próprias
        // Admin pode ver tudo
        // ============================================================
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ConsultaDto>>> BuscarTodasConsultas()
        {
            try
            {
                var role = GetUserRole();
                var userId = GetUserId();

                var consultas = await _service.BuscarTodasAsync();
                if (UsuarioEhMedico())
                {
                    consultas = consultas.Where(c => c.MedicoId == userId);
                }
                if (UsuarioEhPaciente())
                {
                    consultas = consultas.Where(c => c.PacienteId == userId);
                }

                return Ok(consultas);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao buscar consultas");
                return StatusCode(500, "Erro interno ao buscar consultas");
            }
        }

      
        [HttpGet("{id}")]
        public async Task<ActionResult<ConsultaDto>> BuscarPorId(int id)
        {
            try
            {
                var consulta = await _service.BuscarPorIdAsync(id);
                var userId = GetUserId();

                if (UsuarioEhPaciente() && consulta.PacienteId != userId)
                    return Forbid("Você não tem permissão para ver esta consulta.");

                return Ok(consulta);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao buscar consulta por ID");
                return NotFound(ex.Message);
            }
        }

  
        [HttpPost]
        [Authorize(Roles = "Medico,Admin")]
        public async Task<ActionResult<ConsultaDto>> Criar([FromBody] CriarConsultaDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

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
        [Authorize(Roles = "Medico,Admin")]
        public async Task<ActionResult<ConsultaDto>> Atualizar(int id, [FromBody] CriarConsultaDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var consulta = await _service.BuscarPorIdAsync(id);

                if (consulta == null)
                    return NotFound("Consulta não encontrada.");

                var result = await _service.AtualizarAsync(id, dto);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao atualizar consulta");
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Medico,Admin")]
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
