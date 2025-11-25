import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "./DashboardInstituicao.css";

export default function DashboardInstituicao() {
  const navigate = useNavigate();
  const [abaAtiva, setAbaAtiva] = useState("dashboard");

  // MOCKS – depois você troca por dados da API
  const resumo = {
    pacientes: 230,
    medicos: 17,
    consultasHoje: 42,
    alertas: 3,
  };

  const dataSemana = [
    { dia: "Seg", consultas: 50 },
    { dia: "Ter", consultas: 45 },
    { dia: "Qua", consultas: 78 },
    { dia: "Qui", consultas: 66 },
    { dia: "Sex", consultas: 74 },
    { dia: "Sab", consultas: 55 },
    { dia: "Dom", consultas: 32 },
  ];

  const medicosMock = [
    { id: 1, nome: "Dr. João Silva", esp: "Clínico Geral", crm: "12345-SP", ativo: true },
    { id: 2, nome: "Dra. Maria Oliveira", esp: "Pediatria", crm: "67890-SP", ativo: true },
    { id: 3, nome: "Dr. Carlos Souza", esp: "Cardiologia", crm: "54321-SP", ativo: false },
  ];

  const consultasMock = [
    { id: 10, paciente: "Ana Paula", medico: "Dr. João Silva", data: "24/11/2025", hora: "08:30", status: "Agendada" },
    { id: 11, paciente: "João Pedro", medico: "Dra. Maria Oliveira", data: "24/11/2025", hora: "09:15", status: "Em espera" },
    { id: 12, paciente: "Carlos Lima", medico: "Dr. Carlos Souza", data: "24/11/2025", hora: "10:00", status: "Realizada" },
  ];

  const pacientesMock = [
    { id: 1, nome: "Ana Paula", nasc: "12/03/1992", doc: "123.456.789-00" },
    { id: 2, nome: "João Pedro", nasc: "05/09/1988", doc: "987.654.321-00" },
    { id: 3, nome: "Carlos Lima", nasc: "23/01/1975", doc: "555.444.333-22" },
  ];

  const materiaisMock = [
    { id: 1, nome: "Seringa 3 mL", qtdUsadaMes: 340, custoTotal: 510.0 },
    { id: 2, nome: "Luvas procedimento (par)", qtdUsadaMes: 780, custoTotal: 1560.0 },
    { id: 3, nome: "Soro fisiológico 0,9% (500 mL)", qtdUsadaMes: 210, custoTotal: 1890.5 },
  ];

  function handleSair() {
    navigate("/login");
  }

  function renderDashboard() {
    return (
      <>
        {/* CARDS SUPERIORES */}
        <div className="inst-cards">
          <div className="inst-card">
            <div className="inst-card-icon">👤</div>
            <div className="inst-card-info">
              <p className="inst-card-label">Pacientes</p>
              <h2 className="inst-card-valor">{resumo.pacientes}</h2>
            </div>
          </div>
          <div className="inst-card">
            <div className="inst-card-icon">👨‍⚕️</div>
            <div className="inst-card-info">
              <p className="inst-card-label">Médicos</p>
              <h2 className="inst-card-valor">{resumo.medicos}</h2>
            </div>
          </div>
          <div className="inst-card">
            <div className="inst-card-icon">🩺</div>
            <div className="inst-card-info">
              <p className="inst-card-label">Consultas hoje</p>
              <h2 className="inst-card-valor">{resumo.consultasHoje}</h2>
            </div>
          </div>
          <div className="inst-card inst-card-alerta">
            <div className="inst-card-icon">⚠️</div>
            <div className="inst-card-info">
              <p className="inst-card-label">Alertas</p>
              <h2 className="inst-card-valor">{resumo.alertas}</h2>
            </div>
          </div>
        </div>

        {/* GRÁFICO DE LINHA */}
        <div className="inst-grafico-card">
          <h3>Consultas na Semana</h3>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dataSemana}>
              <CartesianGrid stroke="#e5e7eb" />
              <XAxis dataKey="dia" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="consultas"
                stroke="#0b6cff"
                strokeWidth={3}
                dot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* ALERTAS */}
        <div className="inst-alertas">
          <h3>Alertas de Anomalia</h3>

          <div className="inst-alerta-item">
            <div>
              <strong>Ana Beatriz</strong>
              <p>Pressão alta em acompanhamento.</p>
            </div>
            <span className="alerta-badge">Alto</span>
          </div>
        </div>
      </>
    );
  }

  function renderMedicos() {
    return (
      <section className="inst-section-card">
        <div className="inst-section-header">
          <h2>Médicos da Instituição</h2>
          <button className="btn-primario">Cadastrar novo médico</button>
        </div>

        <table className="inst-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Especialidade</th>
              <th>CRM</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {medicosMock.map((m) => (
              <tr key={m.id}>
                <td>{m.nome}</td>
                <td>{m.esp}</td>
                <td>{m.crm}</td>
                <td>
                  <span
                    className={
                      m.ativo ? "status-pill status-ativo" : "status-pill status-inativo"
                    }
                  >
                    {m.ativo ? "Ativo" : "Inativo"}
                  </span>
                </td>
                <td>
                  <button className="btn-secundario btn-sm">Detalhes</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    );
  }

  function renderConsultas() {
    return (
      <section className="inst-section-card">
        <div className="inst-section-header">
          <h2>Agenda e Consultas</h2>
          <button className="btn-primario">Agendar nova consulta</button>
        </div>

        <table className="inst-table">
          <thead>
            <tr>
              <th>Data</th>
              <th>Hora</th>
              <th>Paciente</th>
              <th>Médico</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {consultasMock.map((c) => (
              <tr key={c.id}>
                <td>{c.data}</td>
                <td>{c.hora}</td>
                <td>{c.paciente}</td>
                <td>{c.medico}</td>
                <td>{c.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    );
  }

  function renderPacientes() {
    return (
      <section className="inst-section-card">
        <div className="inst-section-header">
          <h2>Pacientes</h2>
        </div>

        <input
          type="text"
          placeholder="Buscar paciente por nome ou documento..."
          className="inst-input-busca"
        />

        <table className="inst-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Data de nascimento</th>
              <th>Documento</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {pacientesMock.map((p) => (
              <tr key={p.id}>
                <td>{p.nome}</td>
                <td>{p.nasc}</td>
                <td>{p.doc}</td>
                <td>
                  <button className="btn-secundario btn-sm">
                    Ver histórico completo
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    );
  }

  function renderMateriais() {
    return (
      <section className="inst-section-card">
        <div className="inst-section-header">
          <h2>Materiais & Medicamentos</h2>
        </div>

        <p className="inst-text-muted">
          Controle de uso e custo de materiais e medicamentos por mês. No futuro, esses
          dados podem vir do módulo de estoque + registros de consulta.
        </p>

        <table className="inst-table">
          <thead>
            <tr>
              <th>Material / Medicamento</th>
              <th>Qtd. usada (mês)</th>
              <th>Custo total (R$)</th>
            </tr>
          </thead>
          <tbody>
            {materiaisMock.map((m) => (
              <tr key={m.id}>
                <td>{m.nome}</td>
                <td>{m.qtdUsadaMes}</td>
                <td>
                  R{" "}
                  {m.custoTotal.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    );
  }

  function renderConteudo() {
    switch (abaAtiva) {
      case "medicos":
        return renderMedicos();
      case "consultas":
        return renderConsultas();
      case "pacientes":
        return renderPacientes();
      case "materiais":
        return renderMateriais();
      case "dashboard":
      default:
        return renderDashboard();
    }
  }

  return (
    <div className="inst-page">
      {/* HEADER COM CLINIDATA IGUAL AO DO MÉDICO */}
      <header className="inst-header">
        <div>
          <div className="logo-clinidata">
            <span className="logo-main">CLINIDATA</span>
            <span className="logo-sub">Dashboard da Instituição</span>
          </div>
          <p className="inst-header-subtitle">
            Relatórios financeiros, consultas, leitos e materiais em um só lugar.
          </p>
        </div>

        <button className="btn-sair" onClick={handleSair}>
          Sair
        </button>
      </header>

      {/* MENU HORIZONTAL IGUAL AO DO MÉDICO */}
      <nav className="inst-nav">
        <button
          className={
            abaAtiva === "dashboard" ? "inst-nav-link active" : "inst-nav-link"
          }
          onClick={() => setAbaAtiva("dashboard")}
        >
          Dashboard
        </button>
        <button
          className={
            abaAtiva === "medicos" ? "inst-nav-link active" : "inst-nav-link"
          }
          onClick={() => setAbaAtiva("medicos")}
        >
          Médicos
        </button>
        <button
          className={
            abaAtiva === "consultas" ? "inst-nav-link active" : "inst-nav-link"
          }
          onClick={() => setAbaAtiva("consultas")}
        >
          Consultas
        </button>
        <button
          className={
            abaAtiva === "pacientes" ? "inst-nav-link active" : "inst-nav-link"
          }
          onClick={() => setAbaAtiva("pacientes")}
        >
          Pacientes
        </button>
        <button
          className={
            abaAtiva === "materiais" ? "inst-nav-link active" : "inst-nav-link"
          }
          onClick={() => setAbaAtiva("materiais")}
        >
          Materiais & Medicamentos
        </button>
      </nav>

      {/* CONTEÚDO DA ABA ATIVA */}
      <main className="inst-main">{renderConteudo()}</main>
    </div>
  );
}
