import { useState } from "react";
import { login, saveAuth } from "../../services/authService";
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [erro, setErro] = useState("");

  async function handleLogin(e) {
    e.preventDefault();

    const res = await login(email, password);

    if (!res) {
      setErro("Email ou senha inválidos");
      return;
    }

    saveAuth(res.accessToken, res.role);

    if (res.role === "Medico") window.location.href = "/medico";
    if (res.role === "Instituicao") window.location.href = "/instituicao";
  }

  return (
    <div className="login-bg-modern">
      <div className="login-card-modern">
        <h2>CliniData</h2>
        <p className="subtitle">Acesse sua conta</p>

        {erro && <div className="error-box">{erro}</div>}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email</label>
            <input 
              type="email"
              onChange={e => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Senha</label>
            <input 
              type="password"
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          <button className="btn-modern">Entrar</button>
        </form>

        <p className="register-link">
          Não tem conta? <a href="/cadastro">Criar conta</a>
        </p>
      </div>
    </div>
  );
}
