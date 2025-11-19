import api from "./api";


export async function login(email, password) {
try {
const res = await api.post('/auth/login', { email, password });
return res.data;
} catch (err) {
// retorne erro detalhado quando precisar
return null;
}
}


export function saveAuth(token, role) {
localStorage.setItem('token', token);
localStorage.setItem('role', role);
}


export function logout() {
localStorage.removeItem('token');
localStorage.removeItem('role');
}


export function getRole() {
return localStorage.getItem('role');
}

export async function registerInstituicao(dto, password) {
  return api.post("/auth/register/instituicao", { ...dto, password })
    .then(r => r.data)
    .catch(() => null);
}

export async function registerMedico(dto, password) {
  return api.post("/auth/register/medico", { ...dto, password })
    .then(r => r.data)
    .catch(() => null);
}

export async function getEspecialidades() {
  return api.get("/especialidade")
    .then(r => r.data)
    .catch(() => []);
}
