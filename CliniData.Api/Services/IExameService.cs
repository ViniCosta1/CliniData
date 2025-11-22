using CliniData.Api.DTOs;
using CliniData.Domain.Entities;

public interface IExameService
{
    Task<IEnumerable<ExameDto>> BuscarTodosAsync();
    Task<ExameDto> BuscarPorIdAsync(int id);
    Task<ExameDto> CriarAsync(CriarExameDto dto);
    Task<ExameDto> AtualizarAsync(int id, CriarExameDto dto);
    Task RemoverAsync(int id);

    Task<ExameDto> CriarComArquivoAsync(CriarExameFormDto dto);
    Task<ExameDto> AtualizarComArquivoAsync(int id, CriarExameFormDto dto);

    // 🔥 ADICIONADO
    Task<IEnumerable<ExameDto>> BuscarDoPacienteAtualAsync();
    Task<IEnumerable<Exame>> ObterPorPacienteAsync(int pacienteId);
    Task<Exame?> ObterPorIdAsync(int exameId);
    Task<bool> VerificarPropriedadeDoExameAsync(int exameId, int userId);

}
