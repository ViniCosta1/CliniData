// src/services/medicoService.js
const API_BASE_URL = import.meta.env.VITE_API_URL ?? "https://localhost:5001/api";

async function httpGet(path) {
  const resp = await fetch(`${API_BASE_URL}${path}`);
  if (!resp.ok) throw new Error(`GET ${path} - ${resp.status}`);
  return resp.json();
}

async function httpPost(path, body) {
  const resp = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!resp.ok) throw new Error(`POST ${path} - ${resp.status}`);
  return resp.json();
}

export async function buscarDetalhesPaciente(pacienteId) {
  return httpGet(`/pacientes/${pacienteId}`);
}

export async function buscarProntuarioDaConsulta(consultaId) {
  return httpGet(`/consultas/${consultaId}/prontuario`);
}

export async function salvarProntuarioDaConsulta(consultaId, dados) {
  return httpPost(`/consultas/${consultaId}/prontuario`, dados);
}

export async function buscarConsultasAnteriores(pacienteId) {
  return httpGet(`/pacientes/${pacienteId}/consultas`);
}
