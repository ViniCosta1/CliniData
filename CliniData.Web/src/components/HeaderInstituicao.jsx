import React from "react";
import { Link } from "react-router-dom";
import "./HeaderInstituicao.css";

export default function HeaderInstituicao() {
  return (
    <header className="inst-header">
      <div className="inst-logo">CliniData</div>

      <nav className="inst-nav">
        <Link to="/instituicao/dashboard">Dashboard</Link>
        <Link to="/instituicao/cadastrar-medico">Cadastrar Médico</Link>
        <Link to="/instituicao/cadastrar-paciente">Cadastrar Paciente</Link>
        <Link to="/instituicao/relatorios">Relatórios</Link>
      </nav>
    </header>
  );
}
