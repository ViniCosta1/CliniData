using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CliniData.Api.Services;
using CliniData.Api.Utils;

[ApiController]
[Route("api/medicos/exames")]
[Authorize(AuthenticationSchemes = "Identity.Application, Bearer", Policy = "Medico")]// ?? Agora só o paciente acessa esse controller inteiro

public class ExamesMedicoController : ControllerBase
{
    private readonly IExameService _exameService;

    public ExamesMedicoController(IExameService exameService)
    {
        _exameService = exameService;
    }

    // (1) Médico lista exames de um paciente
    [HttpGet("paciente/{pacienteId}")]
    public async Task<IActionResult> ListarPorPaciente(int pacienteId)
    {
        var exames = await _exameService.ObterPorPacienteAsync(pacienteId);
        return Ok(exames);
    }

    // (2) Médico vê detalhes de um exame
    [HttpGet("{exameId}")]
    public async Task<IActionResult> Obter(int exameId)
    {
        var exame = await _exameService.ObterPorIdAsync(exameId);

        if (exame == null)
            return NotFound();

        return Ok(exame);
    }

    // (3) Médico baixa o documento
    [HttpGet("{exameId}/arquivo")]
    public async Task<IActionResult> BaixarArquivo(int exameId)
    {
        var exame = await _exameService.ObterPorIdAsync(exameId);

        if (exame == null || exame.DocumentoExame == null)
            return NotFound("Exame não encontrado ou sem arquivo.");

        string extensao = exame.Extensao ?? "";
        string fileName = $"exame_{exame.Id}{extensao}";
        string contentType = MimeTypes.GetMimeType(fileName);

        return File(exame.DocumentoExame, contentType, fileName);
    }

}
