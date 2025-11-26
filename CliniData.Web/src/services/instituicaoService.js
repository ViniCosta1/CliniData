const BASE_URL = "https://localhost:7067";

// helper: lê token do localStorage e retorna headers base com Authorization quando disponível
function getAuthHeaders(additional = {}) {
	const token = localStorage.getItem("token");
	const auth = token ? { Authorization: `Bearer ${token}` } : {};
	return { ...auth, ...additional };
}

async function handleResponse(res) {
	if (!res.ok) {
		// tenta ler texto/JSON para obter mensagem de erro
		const text = await res.text().catch(() => '');
		let errMsg = text || res.statusText || 'Erro na requisição';
		throw new Error(errMsg);
	}
	// Se não houver conteúdo
	if (res.status === 204) return null;
	// tenta parsear JSON; se falhar, retorna texto cru
	const text = await res.text().catch(() => '');
	if (!text) return null;
	try {
		return JSON.parse(text);
	} catch {
		// resposta não-JSON (p.ex. "Vínculo criado...") — retorna o texto cru
		return text;
	}
}

export async function adicionarMedicoInstituicao(payload) {
	// payload: { medicoId, instituicaoId, ... } conforme API
	const url = `${BASE_URL}/api/MedicoInstituicao/adicionar`;
	const res = await fetch(url, {
		method: 'POST',
		headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
		body: JSON.stringify(payload),
		credentials: 'include'
	});
	return handleResponse(res);
}

export async function removerMedicoInstituicao(payload) {
	// payload: { medicoId, instituicaoId } — adapta conforme a API (DELETE com body)
	const url = `${BASE_URL}/api/MedicoInstituicao/remover`;
	const res = await fetch(url, {
		method: 'DELETE',
		headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
		body: JSON.stringify(payload),
		credentials: 'include'
	});
	return handleResponse(res);
}

export async function getMedicoPorId(medicoId) {
	// medicoId: id do médico
	const url = `${BASE_URL}/api/MedicoInstituicao/medico/${encodeURIComponent(medicoId)}`;
	const res = await fetch(url, {
		method: 'GET',
		headers: getAuthHeaders({ 'Accept': 'application/json' }),
		credentials: 'include'
	});
	return handleResponse(res);
}

export async function getMedicosPorInstituicao() {
	// instituicaoId pode ser passado; se não, chama o endpoint raíz que retorna lista conforme API
	const url =`${BASE_URL}/api/MedicoInstituicao/instituicao/medicos`;
	const res = await fetch(url, {
		method: 'GET',
		headers: getAuthHeaders({ 'Accept': 'application/json' }),
		credentials: 'include'
	});
	return handleResponse(res);
}

export async function getMedicos() {
	const url = `${BASE_URL}/api/medicos`;
	const res = await fetch(url, {
		method: 'GET',
		headers: getAuthHeaders({ 'Accept': 'application/json' }),
		credentials: 'include'
	});
	return handleResponse(res);
}

// Novo: obter lista de instituições
export async function getInstituicoes() {
	const url = `${BASE_URL}/api/Instituicoes`;
	const res = await fetch(url, {
		method: 'GET',
		headers: getAuthHeaders({ 'Accept': 'application/json' }),
		credentials: 'include'
	});
	return handleResponse(res);
}

// Export padrão compatível com outros serviços
export default {
	adicionarMedicoInstituicao,
	removerMedicoInstituicao,
	getMedicoPorId,
	getMedicosPorInstituicao,
	getMedicos,
	getInstituicoes
};