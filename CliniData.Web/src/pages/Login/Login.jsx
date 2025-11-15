import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login as apiLogin, saveAuth } from "../../services/authService";
import "../../index.css";
import "./Login.css";
import Logo from "../../assets/logo.png"; // 👈 sua logo

export default function Login() {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const navigate = useNavigate();

    async function handleLogin(e) {
        e.preventDefault();

        try {
            const response = await apiLogin(email, senha);
            saveAuth(response);
            navigate("/instituicao/dashboard");
        } catch (error) {
            alert("Erro ao fazer login. Verifique suas credenciais.");
        }
    }

    return (
        <div className="login-container">
            
            <img src={Logo} alt="Logo" className="login-logo" /> {/* 🔥 logo em cima */}

            <h1 className="login-title">CliniData</h1>

            <form onSubmit={handleLogin} className="login-form">
                
                <input 
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input 
                    type="password"
                    placeholder="Senha"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                />

                <button type="submit" className="login-button">Entrar</button>
            </form>

            <button 
                className="register-button"
                onClick={() => navigate("/cadastro")}
            >
                Cadastrar-se
            </button>

        </div>
    );
}
