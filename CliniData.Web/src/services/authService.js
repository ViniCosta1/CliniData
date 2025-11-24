import api from "./api";

// LOGIN
export async function login(email, password) {
  try {
    const res = await api.post("/login", { email, password });
    return res.data;
  } catch (err) {
    console.error("Erro no login:", err);
    return null;
  }
}

// LISTAR ESPECIALIDADES
export async function getEspecialidades() {
  try {
    const res = await api.get("/especialidade");
    return res.data;
  } catch (err) {
    console.error("Erro ao buscar especialidades:", err);
    return [];
  }
}


// SALVAR AUTENTICAÇÃO
export function saveAuth(token, role) {
  localStorage.setItem("token", token);
  localStorage.setItem("role", role);
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
}

export function getRole() {
  return localStorage.getItem("role");
}

// CADASTRAR INSTITUIÇÃO
export function registerInstituicao(dto) {
  return api.post("/instituicao", dto)
    .then(r => r.data)
    .catch((err) => {
      console.error("Erro no cadastro instituicao:", err);
      return null;
    });
}

// CADASTRAR MÉDICO
export function registerMedico(dto) {
  return api.post("/medico", dto)
    .then(r => r.data)
    .catch((err) => {
      console.error("Erro no cadastro medico:", err);
      return null;
    });
}
