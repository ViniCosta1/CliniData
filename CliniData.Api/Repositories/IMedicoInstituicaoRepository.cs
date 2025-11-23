using CliniData.Domain.Entities;

public interface IMedicoInstituicaoRepository
{
    Task<bool> JaExisteLigacaoAsync(int medicoId, int instituicaoId);
    Task AdicionarAsync(int medicoId, int instituicaoId);
    Task RemoverAsync(int medicoId, int instituicaoId);

    Task<IEnumerable<Instituicao>> BuscarInstituicoesDoMedicoAsync(int medicoId);
    Task<IEnumerable<Medico>> BuscarMedicosDaInstituicaoAsync(int instituicaoId);
}
