using CliniData.Api.DTOs;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace CliniData.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]

    [Authorize(AuthenticationSchemes = "Identity.Application, Bearer", Policy = "Paciente")]// 🔒 Agora só o paciente acessa esse controller inteiro
    public class ExameController : ControllerBase
    {
        private readonly IExameService _exameService;

        public ExameController(IExameService exameService)
        {
            _exameService = exameService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            return Ok(await _exameService.BuscarTodosAsync());
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            return Ok(await _exameService.BuscarPorIdAsync(id));
        }

        [HttpGet("me")]
        public async Task<IActionResult> GetMine()
        {
            return Ok(await _exameService.BuscarDoPacienteAtualAsync());
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] CriarExameDto dto)
        {
            return Ok(await _exameService.CriarAsync(dto));
        }

        [HttpPost("upload")]
        public async Task<IActionResult> PostFile([FromForm] CriarExameFormDto dto)
        {
            return Ok(await _exameService.CriarComArquivoAsync(dto));
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] CriarExameDto dto)
        {
            return Ok(await _exameService.AtualizarAsync(id, dto));
        }

        [HttpPut("upload/{id}")]
        public async Task<IActionResult> PutFile(int id, [FromForm] CriarExameFormDto dto)
        {
            return Ok(await _exameService.AtualizarComArquivoAsync(id, dto));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _exameService.RemoverAsync(id);
            return NoContent();
        }

        // ------------------------------------------------------------
        // 🔽 NOVO ENDPOINT: Paciente baixa o próprio exame
        // ------------------------------------------------------------
        [HttpGet("{exameId}/arquivo")]
        public async Task<IActionResult> BaixarArquivo(int exameId)
        {
            var exame = await _exameService.ObterPorIdAsync(exameId);

            if (exame == null || exame.DocumentoExame == null)
                return NotFound("Exame não encontrado ou sem arquivo.");

            // Agora funciona com cookie auth (Identity)
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value
                ?? throw new Exception("Usuário não identificado.");

            var pertenceAoPaciente = await _exameService.VerificarPropriedadeDoExameAsync(exameId, int.Parse(userId));

            if (!pertenceAoPaciente)
                return Forbid("Você não tem permissão para acessar este exame.");

            string contentType = "application/octet-stream";
            string fileName = $"exame_{exame.Id}";

            return File(exame.DocumentoExame, contentType, fileName);
        }

    }
}
