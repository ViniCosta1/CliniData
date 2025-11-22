import api from "./api";

export async function cadastrarInstituicao(data) {
    const payload = {
        nome: data.nome,
        cnpj: data.cnpj,
        contato: data.telefone,
        endereco: {
            rua: data.rua,
            numero: data.numero,
            bairro: data.bairro,
            cidade: data.cidade,
            estado: data.estado,
            cep: data.cep
        }
    };

    // senha deve ir NA URL, não no body
    return api.post(`/api/Auth/register/instituicao?password=${data.senha}`, payload);
}

export async function cadastrarMedico(data) {
    const payload = {
        nome: data.nome,
        crm: data.crm,
        email: data.email,
        contato: data.telefone,
        especialidadeId: Number(data.especialidadeId)
    };

    // idem para médico
    return api.post(`/api/Auth/register/medico?password=${data.senha}`, payload);
}
  s