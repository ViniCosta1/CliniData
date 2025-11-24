using CliniData.Api.DTOs;
using CliniData.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CliniData.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(AuthenticationSchemes = "Identity.Application, Bearer", Policy = "Instituicao")]
    public class MedicoInstituicaoController : ControllerBase
    {
        private readonly IMedicoInstituicaoService _service;

        public MedicoInstituicaoController(IMedicoInstituicaoService service)
        {
            _service = service;
        }

        [HttpPost("adicionar")]
        public async Task<ActionResult> Adicionar([FromBody] VincularMedicoInstituicaoDto dto)
        {
            await _service.VincularAsync(dto);
            return Ok("Vínculo criado com sucesso");
        }

        [HttpDelete("remover")]
        public async Task<ActionResult> Remover([FromBody] VincularMedicoInstituicaoDto dto)
        {
            await _service.RemoverAsync(dto);
            return Ok("Vínculo removido");
        }

        [HttpGet("medico/{id}")]
        public async Task<ActionResult<IEnumerable<InstituicaoDeMedicoDto>>> BuscarInstituicoesDoMedico(int id)
        {
            var lista = await _service.BuscarInstituicoesDoMedicoAsync(id);
            return Ok(lista);
        }

        // Lista os médicos da instituição logada (não recebe id)
        [HttpGet("instituicao/medicos")]
        public async Task<ActionResult<IEnumerable<MedicoEmInstituicaoDto>>> BuscarMedicosDaInstituicao()
        {
            var lista = await _service.BuscarMedicosDaInstituicaoAsync();
            return Ok(lista);
        }
    }
}
