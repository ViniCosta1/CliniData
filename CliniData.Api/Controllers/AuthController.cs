using Microsoft.AspNetCore.Mvc;
using CliniData.Api.DTOs;
using CliniData.Api.Services;

namespace CliniData.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _authService;

        public AuthController(AuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register/paciente")]
        public async Task<IActionResult> RegisterPaciente([FromBody] CriarPacienteDto dto)
        {
            var result = await _authService.RegisterPacienteAsync(dto);
            if (!result.Sucesso)
                return BadRequest(result.Mensagem);

            return Ok(new { message = result.Mensagem });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            var response = await _authService.LoginAsync(dto);
            if (response == null)
                return Unauthorized("Email ou senha inválidos");

            return Ok(response);
        }
        [HttpPost("register/medico")]
        public async Task<IActionResult> RegisterMedico([FromBody] CriarMedicoDto dto, [FromQuery] string password)
        {
            var result = await _authService.RegisterMedicoAsync(dto, password);
            if (!result.Sucesso)
                return BadRequest(result.Mensagem);

            return Ok(new { message = result.Mensagem });
        }

        [HttpPost("register/instituicao")]
        public async Task<IActionResult> RegisterInstituicao([FromBody] CriarInstituicaoDto dto, [FromQuery] string password)
        {
            var result = await _authService.RegisterInstituicaoAsync(dto, password);
            if (!result.Sucesso)
                return BadRequest(result.Mensagem);

            return Ok(new { message = result.Mensagem });
        }

    }
}
