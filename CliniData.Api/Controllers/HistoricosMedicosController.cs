using CliniData.Api.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
[Authorize]
[Authorize(AuthenticationSchemes = "Identity.Application, Bearer", Policy = "MedicoOuPaciente")]// 🔒 Agora só o paciente acessa esse controller inteiro
public class HistoricosMedicosController : ControllerBase
{
    private readonly IHistoricoMedicoService _service;

    public HistoricosMedicosController(IHistoricoMedicoService service)
    {
        _service = service;
    }

    // ================================
    // PACIENTE: todos dele mesmo
    // ================================
    [HttpGet("paciente")]
    [Authorize(Roles = "Paciente")]
    public async Task<ActionResult<IEnumerable<HistoricoMedicoDto>>> BuscarDoPacienteAtual()
    {
        return Ok(await _service.BuscarTodosDoPacienteAtualAsync());
    }

    // ================================
    // MÉDICO: todos que ele criou
    // ================================
    [HttpGet("medico")]
    [Authorize(Roles = "Medico")]
    public async Task<ActionResult<IEnumerable<HistoricoMedicoDto>>> BuscarDoMedicoAtual()
    {
        return Ok(await _service.BuscarTodosDoMedicoAtualAsync());
    }
        
    // ================================
    // Buscar por paciente específico (médico pode usar)
    // ================================
    [HttpGet("paciente/{pacienteId}")]
    [Authorize(Roles = "Medico")]
    public async Task<ActionResult<IEnumerable<HistoricoMedicoDto>>> BuscarPorPaciente(int pacienteId)
    {
        return Ok(await _service.BuscarPorPacienteAsync(pacienteId));
    }

    // ================================
    // Buscar por ID
    // ================================
    [HttpGet("{id}")]
    [Authorize(Roles = "Medico,Paciente")]
    public async Task<ActionResult<HistoricoMedicoDto>> BuscarPorId(int id)
    {
        return Ok(await _service.BuscarPorIdAsync(id));
    }

    // ================================
    // Criar
    // ================================
    [HttpPost]
    [Authorize(Roles = "Medico")]
    public async Task<ActionResult> Criar(CriarHistoricoMedicoDto dto)
    {
        var criado = await _service.CriarAsync(dto);
        return CreatedAtAction(nameof(BuscarPorId), new { id = criado.IdHistorico }, criado);
    }

    // ================================
    // Atualizar
    // ================================
    [HttpPut("{id}")]
    [Authorize(Roles = "Medico")]
    public async Task<ActionResult> Atualizar(int id, EditarHistoricoMedicoDto dto)
    {
        return Ok(await _service.AtualizarAsync(id, dto));
    }

    // ================================
    // Remover
    // ================================
    [HttpDelete("{id}")]
    [Authorize(Roles = "Medico")]
    public async Task<ActionResult> Remover(int id)
    {
        await _service.RemoverAsync(id);
        return NoContent();
    }
}
