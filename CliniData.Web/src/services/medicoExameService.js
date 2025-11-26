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

// GET /api/medicos/exames/paciente/{pacienteId}
export async function getExamesPorPaciente(pacienteId) {
	const url = `${BASE_URL}/api/medicos/exames/paciente/${encodeURIComponent(pacienteId)}`;
	const res = await fetch(url, {
		method: "GET",
		headers: getAuthHeaders({ Accept: "application/json" }),
		credentials: "include",
	});
	return handleResponse(res);
}

// GET /api/medicos/exames/{exameId}
export async function getExamePorId(exameId) {
	const url = `${BASE_URL}/api/medicos/exames/${encodeURIComponent(exameId)}`;
	const res = await fetch(url, {
		method: "GET",
		headers: getAuthHeaders({ Accept: "application/json" }),
		credentials: "include",
	});
	return handleResponse(res);
}

// GET /api/medicos/exames/{exameId}/arquivo
// Retorna Blob (arquivo). Em caso de erro, tenta ler mensagem de erro e lançar.
export async function getExameArquivo(exameId) {
	const url = `${BASE_URL}/api/medicos/exames/${encodeURIComponent(exameId)}/arquivo`;
	const res = await fetch(url, {
		method: "GET",
		headers: getAuthHeaders({ Accept: "*/*" }),
		credentials: "include",
	});
	if (!res.ok) {
		const text = await res.text().catch(() => "");
		const errMsg = text || res.statusText || "Erro ao obter arquivo do exame";
		throw new Error(errMsg);
	}
	// retorna blob (pode ser imagem/pdf)
	return res.blob();
}

export default {
	getExamesPorPaciente,
	getExamePorId,
	getExameArquivo,
};
