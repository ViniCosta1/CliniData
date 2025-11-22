using System;

namespace CliniData.Api.Services
{
    public interface IUsuarioAtualService
    {
        /// <summary>
        /// Retorna o ID do usuário autenticado no contexto atual.
        /// Pode retornar null se ninguém estiver logado.
        /// </summary>
        string? ObterUsuarioId();
    }
}
