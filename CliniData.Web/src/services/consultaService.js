const BASE_URL = "https://localhost:7067";

// helper: lê token do localStorage e retorna headers base com Authorization quando disponível
function getAuthHeaders(additional = {}) {
	const token = localStorage.getItem("token");
	const auth = token ? { Authorization: `Bearer ${token}` } : {};
	return { ...auth, ...additional };
}

async function handleResponse(res) {
	if (!res.ok) {
		const text = await res.text().catch(() => "");
		const errMsg = text || res.statusText || "Erro na requisição";
		throw new Error(errMsg);
	}
	if (res.status === 204) return null;
	const text = await res.text().catch(() => "");
	if (!text) return null;
	try {
		return JSON.parse(text);
	} catch {
		return text;
	}
}

export async function getConsultas() {
	const url = `${BASE_URL}/api/Consultas`;
	const res = await fetch(url, {
		method: "GET",
		headers: getAuthHeaders({ Accept: "application/json" }),
		credentials: "include",
	});
	return handleResponse(res);
}

export async function criarConsulta(payload) {
	const url = `${BASE_URL}/api/Consultas`;
	const res = await fetch(url, {
		method: "POST",
		headers: getAuthHeaders({ "Content-Type": "application/json" }),
		body: JSON.stringify(payload),
		credentials: "include",
	});
	return handleResponse(res);
}

export async function getConsultaPorId(id) {
	const url = `${BASE_URL}/api/Consultas/${encodeURIComponent(id)}`;
	const res = await fetch(url, {
		method: "GET",
		headers: getAuthHeaders({ Accept: "application/json" }),
		credentials: "include",
	});
	return handleResponse(res);
}

export async function atualizarConsulta(id, payload) {
	const url = `${BASE_URL}/api/Consultas/${encodeURIComponent(id)}`;
	const res = await fetch(url, {
		method: "PUT",
		headers: getAuthHeaders({ "Content-Type": "application/json" }),
		body: JSON.stringify(payload),
		credentials: "include",
	});
	return handleResponse(res);
}

export async function removerConsulta(id) {
	const url = `${BASE_URL}/api/Consultas/${encodeURIComponent(id)}`;
	const res = await fetch(url, {
		method: "DELETE",
		headers: getAuthHeaders({ Accept: "application/json" }),
		credentials: "include",
	});
	return handleResponse(res);
}

export async function getConsultasClaims() {
	const url = `${BASE_URL}/api/Consultas/claims`;
	const res = await fetch(url, {
		method: "GET",
		headers: getAuthHeaders({ Accept: "application/json" }),
		credentials: "include",
	});
	return handleResponse(res);
}

// Export padrão compatível com outros módulos
export default {
	getConsultas,
	criarConsulta,
	getConsultaPorId,
	atualizarConsulta,
	removerConsulta,
	getConsultasClaims,
};
