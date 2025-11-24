using CliniData.Api.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

public interface IMedicoInstituicaoService
{
    Task VincularAsync(VincularMedicoInstituicaoDto dto);
    Task RemoverAsync(VincularMedicoInstituicaoDto dto);

    // Retorna as instituições em que um médico está vinculado
    Task<IEnumerable<InstituicaoDeMedicoDto>> BuscarInstituicoesDoMedicoAsync(int medicoId);

    // Retorna os médicos da INSTITUIÇÃO atualmente logada
    Task<IEnumerable<MedicoEmInstituicaoDto>> BuscarMedicosDaInstituicaoAsync();

}
