import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./DashboardMedico.css";
import ConsultasMedico from "./ConsultasMedico";

export default function DashboardMedico() {
  const [abaAtiva, setAbaAtiva] = useState("consultas");
  const navigate = useNavigate();

  // MOCK de dados por enquanto.
  // Depois você troca para dados reais vindos da API.
  const consultasDoDia = [
    {
      id: 10,
      pacienteId: 1,
      pacienteNome: "João Silva",
      horario: "08:30",
      motivo: "Dor de cabeça e febre",
      status: "Agendada",
    },
    {
      id: 11,
      pacienteId: 2,
      pacienteNome: "Maria Oliveira",
      horario: "09:15",
      motivo: "Retorno de exame",
      status: "Em espera",
    },
    {
      id: 12,
      pacienteId: 3,
      pacienteNome: "Carlos Souza",
      horario: "10:00",
      motivo: "Consulta de rotina",
      status: "Agendada",
    },
  ];

  const pacientesMock = [
    { id: 1, nome: "João Silva", idade: 34, sexo: "M", cpf: "123.456.789-00" },
    { id: 2, nome: "Maria Oliveira", idade: 28, sexo: "F", cpf: "987.654.321-00" },
    { id: 3, nome: "Carlos Souza", idade: 45, sexo: "M", cpf: "555.444.333-22" },
  ];

  function abrirProntuario(pacienteId, consultaId) {
    navigate(`/medico/prontuario/${pacienteId}/${consultaId}`);
  }

  function renderConteudo() {
    switch (abaAtiva) {
      case "consultas":
        return (
          <ConsultasMedico
            consultas={consultasDoDia}
            onAtender={abrirProntuario}
          />
        );

      case "pacientes":
        return (
          <section className="card">
            <h2 className="card-title">Pacientes</h2>
            <div className="card-body">
              <input
                type="text"
                placeholder="Buscar paciente por nome ou CPF..."
                className="input-inline"
              />
              <table className="tabela-simples">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Idade</th>
                    <th>Sexo</th>
                    <th>CPF</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {pacientesMock.map((p) => (
                    <tr key={p.id}>
                      <td>{p.nome}</td>
                      <td>{p.idade}</td>
                      <td>{p.sexo}</td>
                      <td>{p.cpf}</td>
                      <td>
                        <button
                          className="btn btn-outline"
                          onClick={() => navigate(`/medico/prontuario/${p.id}/0`)}
                        >
                          Ver prontuário
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        );

      case "agenda":
        return (
          <section className="card">
            <h2 className="card-title">Agenda</h2>
            <div className="card-body">
              <p className="texto-muted">
                Aqui você pode integrar com a API para listar os próximos dias, horários
                e consultas do médico, como uma visão de calendário ou lista.
              </p>
              <ul className="lista-simples">
                <li>📅 Amanhã - 08:30 - João Silva</li>
                <li>📅 Amanhã - 09:15 - Maria Oliveira</li>
                <li>📅 2 dias - 10:00 - Carlos Souza</li>
              </ul>
            </div>
          </section>
        );

      case "insights":
        return (
          <section className="card">
            <h2 className="card-title">Insights do dia</h2>
            <div className="card-body medico-grid-3">
              <div>
                <h3 className="mini-title">Consultas de hoje</h3>
                <p className="big-number">{consultasDoDia.length}</p>
                <p className="texto-muted">
                  Quantidade total de atendimentos previstos para o dia.
                </p>
              </div>
              <div>
                <h3 className="mini-title">Pacientes novos</h3>
                <p className="big-number">2</p>
                <p className="texto-muted">
                  Integre com a API para mostrar quantos são primeira consulta.
                </p>
              </div>
              <div>
                <h3 className="mini-title">Exames pendentes</h3>
                <p className="big-number">5</p>
                <p className="texto-muted">
                  Você pode puxar da API os exames ainda não avaliados.
                </p>
              </div>
            </div>
          </section>
        );

      default:
        return null;
    }
  }

  return (
    <div className="medico-page">
      {/* HEADER */}
      <header className="medico-header">
        <div>
          <div className="logo-clinidata">
            <span className="logo-main">CLINIDATA</span>
            <span className="logo-sub">Painel do Médico</span>
          </div>
          <p className="texto-muted medico-subtitle">
            Acompanhe suas consultas, pacientes e agenda em um só lugar.
          </p>
        </div>
        <button
          className="btn btn-outline medico-btn-sair"
          onClick={() => navigate("/login")}
        >
          Sair
        </button>
      </header>

      {/* MENU HORIZONTAL */}
      <nav className="medico-nav">
        <button
          className={
            abaAtiva === "consultas" ? "medico-nav-link active" : "medico-nav-link"
          }
          onClick={() => setAbaAtiva("consultas")}
        >
          Consultas
        </button>
        <button
          className={
            abaAtiva === "pacientes" ? "medico-nav-link active" : "medico-nav-link"
          }
          onClick={() => setAbaAtiva("pacientes")}
        >
          Pacientes
        </button>
        <button
          className={
            abaAtiva === "agenda" ? "medico-nav-link active" : "medico-nav-link"
          }
          onClick={() => setAbaAtiva("agenda")}
        >
          Agenda
        </button>
        <button
          className={
            abaAtiva === "insights" ? "medico-nav-link active" : "medico-nav-link"
          }
          onClick={() => setAbaAtiva("insights")}
        >
          Insights
        </button>
      </nav>

      {/* CONTEÚDO DA ABA */}
      <main className="medico-main">{renderConteudo()}</main>
    </div>
  );
}
