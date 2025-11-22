using CliniData.Api.DTOs;

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
}
