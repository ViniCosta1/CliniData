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

export async function getPacientes() {
	const url = `${BASE_URL}/api/Pacientes`;
	const res = await fetch(url, {
		method: "GET",
		headers: getAuthHeaders({ Accept: "application/json" }),
		credentials: "include",
	});
	return handleResponse(res);
}

export async function criarPaciente(payload) {
	const url = `${BASE_URL}/api/Pacientes`;
	const res = await fetch(url, {
		method: "POST",
		headers: getAuthHeaders({ "Content-Type": "application/json" }),
		body: JSON.stringify(payload),
		credentials: "include",
	});
	return handleResponse(res);
}

export async function getPacientePorId(id) {
	const url = `${BASE_URL}/api/Pacientes/${encodeURIComponent(id)}`;
	const res = await fetch(url, {
		method: "GET",
		headers: getAuthHeaders({ Accept: "application/json" }),
		credentials: "include",
	});
	return handleResponse(res);
}

export async function atualizarPaciente(id, payload) {
	const url = `${BASE_URL}/api/Pacientes/${encodeURIComponent(id)}`;
	const res = await fetch(url, {
		method: "PUT",
		headers: getAuthHeaders({ "Content-Type": "application/json" }),
		body: JSON.stringify(payload),
		credentials: "include",
	});
	return handleResponse(res);
}

export async function removerPaciente(id) {
	const url = `${BASE_URL}/api/Pacientes/${encodeURIComponent(id)}`;
	const res = await fetch(url, {
		method: "DELETE",
		headers: getAuthHeaders({ Accept: "application/json" }),
		credentials: "include",
	});
	return handleResponse(res);
}

export async function getPacientePorCpf(cpf) {
	const url = `${BASE_URL}/api/Pacientes/cpf/${encodeURIComponent(cpf)}`;
	const res = await fetch(url, {
		method: "GET",
		headers: getAuthHeaders({ Accept: "application/json" }),
		credentials: "include",
	});
	return handleResponse(res);
}

// Export padrão compatível com outros serviços
export default {
	getPacientes,
	criarPaciente,
	getPacientePorId,
	atualizarPaciente,
	removerPaciente,
	getPacientePorCpf,
};
