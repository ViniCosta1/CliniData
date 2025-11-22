import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/logo.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const navigate = useNavigate();

  function handleLogin(e) {
    e.preventDefault();

    // 🔥 depois substitui pela API
    if (email && senha) {
      localStorage.setItem("token", "logado");
      navigate("/instituicao");
    } else {
      alert("Preencha os campos.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <img src={Logo} className="w-24 mb-3" />
          <h1 className="text-2xl font-bold">CliniData</h1>
        </div>

        <form className="flex flex-col gap-4" onSubmit={handleLogin}>
          <input
            className="p-3 border rounded-lg"
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="p-3 border rounded-lg"
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />

          <button className="bg-blue-600 text-white rounded-lg p-3 hover:bg-blue-700 transition">
            Entrar
          </button>
        </form>

        <button
          className="mt-4 w-full text-blue-600 hover:underline"
          onClick={() => navigate("/cadastro")}
        >
          Criar conta
        </button>
      </div>
    </div>
  );
}
  //s