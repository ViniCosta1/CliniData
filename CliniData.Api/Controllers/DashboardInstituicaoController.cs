using CliniData.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CliniData.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(AuthenticationSchemes = "Identity.Application, Bearer", Policy = "Instituicao")]
    public class DashboardInstituicaoController : ControllerBase
    {
        private readonly IDashboardInstituicaoService _service;

        public DashboardInstituicaoController(IDashboardInstituicaoService service)
        {
            _service = service;
        }

        [HttpGet("dados")]
        public async Task<IActionResult> BuscarDadosDaInstituicaoAtual()
        {
            var resultado = await _service.BuscarDadosDaInstituicaoAtualAsync();
            return Ok(resultado);
        }

    }
}
