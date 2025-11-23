using CliniData.Api.DTOs;
using CliniData.Api.Services;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

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

        // ?? Logout usando o cookie do Identity — não precisa de SignInManager aqui
        [HttpPost("logout")]
        [Authorize]
        public async Task<IActionResult> Logout()
        {
            // Desloga do esquema de autenticação do Identity (cookie)
            await HttpContext.SignOutAsync(IdentityConstants.ApplicationScheme);
            return Ok(new { message = "Logout realizado com sucesso." });
        }

        [HttpPost("register/paciente")]
        public async Task<IActionResult> RegisterPaciente([FromBody] CriarPacienteDto dto)
        {
            var result = await _authService.RegisterPacienteAsync(dto);
            if (!result.Sucesso)
                return BadRequest(result.Mensagem);

            return Ok(new { message = result.Mensagem });
        }

        
        [HttpPost("register/medico")]
        public async Task<IActionResult> RegisterMedico([FromBody] CriarMedicoDto dto)
        {
            var result = await _authService.RegisterMedicoAsync(dto);
            if (!result.Sucesso)
                return BadRequest(result.Mensagem);

            return Ok(new { message = result.Mensagem });
        }

        [HttpPost("register/instituicao")]
        public async Task<IActionResult> RegisterInstituicao([FromBody] CriarInstituicaoDto dto)
        {
            var result = await _authService.RegisterInstituicaoAsync(dto);
            if (!result.Sucesso)
                return BadRequest(result.Mensagem);

            return Ok(new { message = result.Mensagem });
        }

        [HttpPost("login-mobile")]
        public async Task<IActionResult> LoginMobile([FromBody] LoginDto dto)
        {
            var result = await _authService.LoginJwtAsync(dto);

            if (result == null)
                return Unauthorized(new { message = "E-mail ou senha incorretos" });

            return Ok(result);
        }

    }
}
