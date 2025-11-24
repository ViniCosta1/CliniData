import React, { useState, useEffect } from "react";
import {
  registerInstituicao,
  registerMedico,
  getEspecialidades,
} from "../../services/authService";
import "./Cadastro.css";

export default function Cadastro() {
  const [tipo, setTipo] = useState("instituicao");
  const [especialidades, setEspecialidades] = useState([]);

  useEffect(() => {
    getEspecialidades().then((data) => setEspecialidades(data || []));
  }, []);

  return (
    <div className="cadastro-bg">
      <div className="cadastro-card">
        <h2>Criar Conta</h2>

        <div className="switch">
          <button
            className={tipo === "instituicao" ? "active" : ""}
            onClick={() => setTipo("instituicao")}
          >
            Instituição
          </button>
          <button
            className={tipo === "medico" ? "active" : ""}
            onClick={() => setTipo("medico")}
          >
            Médico
          </button>
        </div>

        {tipo === "instituicao" ? (
          <form onSubmit={async (e) => {
            e.preventDefault();
            const data = Object.fromEntries(new FormData(e.target));
            const ok = await registerInstituicao(data);
            if (!ok) return alert("Erro ao cadastrar.");
            alert("Instituição cadastrada!");
          }}>
            <input name="nome" placeholder="Nome da Instituição" required />
            <input name="cnpj" placeholder="CNPJ" required />
            <input name="telefone" placeholder="Telefone" required />
            <input name="senha" type="password" placeholder="Senha" required />

            <h4>Endereço</h4>

            <input name="rua" placeholder="Rua" />
            <input name="numero" placeholder="Número" />
            <input name="bairro" placeholder="Bairro" />
            <input name="cidade" placeholder="Cidade" />
            <input name="estado" placeholder="Estado" />
            <input name="cep" placeholder="CEP" />

            <button className="btn-modern">Cadastrar</button>
          </form>
        ) : (
          <form onSubmit={async (e) => {
            e.preventDefault();
            const data = Object.fromEntries(new FormData(e.target));
            const ok = await registerMedico(data);
            if (!ok) return alert("Erro ao cadastrar.");
            alert("Médico cadastrado!");
          }}>
            <input name="nome" placeholder="Nome" required />
            <input name="crm" placeholder="CRM" required />
            <input name="email" placeholder="Email" required />
            <input name="telefone" placeholder="Telefone" required />
            <input name="senha" type="password" placeholder="Senha" required />

            <select name="especialidadeId" required>
              <option value="">Selecione uma especialidade</option>
              {especialidades.map((e) => (
                <option key={e.id} value={e.id}>{e.nome}</option>
              ))}
            </select>

            <button className="btn-modern">Cadastrar</button>
          </form>
        )}
      </div>
    </div>
  );
}
