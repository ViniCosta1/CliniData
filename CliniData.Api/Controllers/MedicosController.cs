using CliniData.Api.DTOs;
using CliniData.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CliniData.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(AuthenticationSchemes = "Identity.Application, Bearer")]// 🔒 Agora só o paciente acessa esse controller inteiro

    public class MedicosController : ControllerBase
    {
        private readonly IMedicoService _service;
        private readonly ILogger<MedicosController> _logger;

        public MedicosController(IMedicoService service, ILogger<MedicosController> logger)
        {
            _service = service;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<MedicoDto>>> BuscarTodosMedicos()
        {
            var medicos = await _service.BuscarTodosAsync();
            return Ok(medicos);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<MedicoDto>> BuscarMedicoPorId(int id)
        {
            try
            {
                var medico = await _service.BuscarPorIdAsync(id);
                return Ok(medico);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao buscar médico por ID");
                return NotFound(ex.Message);
            }
        }

        [HttpGet("crm/{crm}")]
        public async Task<ActionResult<MedicoDto>> BuscarMedicoPorCrm(string crm)
        {
            try
            {
                var medico = await _service.BuscarPorCrmAsync(crm);
                return Ok(medico);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao buscar médico por CRM");
                return NotFound(ex.Message);
            }
        }

        [HttpPost]
        public async Task<ActionResult<MedicoDto>> CriarMedico([FromBody] CriarMedicoDto criarDto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            try
            {
                var criado = await _service.CriarAsync(criarDto);
                return CreatedAtAction(nameof(BuscarMedicoPorId), new { id = criado.IdMedico }, criado);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao criar médico");
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<MedicoDto>> AtualizarMedico(int id, [FromBody] CriarMedicoDto atualizarDto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            try
            {
                var atualizado = await _service.AtualizarAsync(id, atualizarDto);
                return Ok(atualizado);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao atualizar médico");
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> RemoverMedico(int id)
        {
            try
            {
                await _service.RemoverAsync(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao remover médico");
                return NotFound(ex.Message);
            }
        }

        [HttpGet("instituicoes")]
        public async Task<ActionResult<IEnumerable<InstituicaoDto>>> BuscarInstituicoesDoMedicoAtual()
        {
            var resultado = await _service.BuscarInstituicoesDoMedicoAtualAsync();
            return Ok(resultado);
        }


    }

}