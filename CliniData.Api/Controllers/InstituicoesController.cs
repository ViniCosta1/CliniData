using Microsoft.AspNetCore.Mvc;
using CliniData.Api.DTOs;
using CliniData.Api.Services;
using Microsoft.AspNetCore.Authorization;

namespace CliniData.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(AuthenticationSchemes = "Identity.Application, Bearer", Policy = "Instituicao")]// 🔒 Agora só o paciente acessa esse controller inteiro

    public class InstituicoesController : ControllerBase
    {
        private readonly IInstituicaoService _service;
        private readonly ILogger<InstituicoesController> _logger;

        public InstituicoesController(IInstituicaoService service, ILogger<InstituicoesController> logger)
        {
            _service = service;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<InstituicaoDto>>> BuscarTodas()
        {
            var instituicoes = await _service.BuscarTodasAsync();
            return Ok(instituicoes);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<InstituicaoDto>> BuscarPorId(int id)
        {
            try
            {
                var instituicao = await _service.BuscarPorIdAsync(id);
                return Ok(instituicao);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao buscar instituição por ID");
                return NotFound(ex.Message);
            }
        }

        [HttpGet("cnpj/{cnpj}")]
        public async Task<ActionResult<InstituicaoDto>> BuscarPorCnpj(string cnpj)
        {
            try
            {
                var instituicao = await _service.BuscarPorCnpjAsync(cnpj);
                return Ok(instituicao);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao buscar instituição por CNPJ");
                return NotFound(ex.Message);
            }
        }

        [HttpPost]
        public async Task<ActionResult<InstituicaoDto>> Criar([FromBody] CriarInstituicaoDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            try
            {
                var instituicao = await _service.CriarAsync(dto);
                return CreatedAtAction(nameof(BuscarPorId), new { id = instituicao.IdInstituicao }, instituicao);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao criar instituição");
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<InstituicaoDto>> Atualizar(int id, [FromBody] CriarInstituicaoDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            try
            {
                var instituicao = await _service.AtualizarAsync(id, dto);
                return Ok(instituicao);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao atualizar instituição");
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
                _logger.LogError(ex, "Erro ao remover instituição");
                return NotFound(ex.Message);
            }
        }
    }
}