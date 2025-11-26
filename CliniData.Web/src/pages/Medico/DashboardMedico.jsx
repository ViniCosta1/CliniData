import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./DashboardMedico.css";
import ConsultasMedico from "./ConsultasMedico";
import pacienteService from "../../services/pacienteService";
import Prontuario from "./Prontuario";

export default function DashboardMedico() {
  const [abaAtiva, setAbaAtiva] = useState("consultas");
  const [pacientes, setPacientes] = useState([]);
  const [pacientesLoading, setPacientesLoading] = useState(false);
  const [pacientesError, setPacientesError] = useState(null);
  const [modalProntuarioOpen, setModalProntuarioOpen] = useState(false);
  const [modalPacienteId, setModalPacienteId] = useState(null);
  const navigate = useNavigate();

  // MOCK de dados por enquanto.
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

  // helper: calcula idade a partir de uma data de nascimento (string ISO ou similar)
  function calculateAge(dataNascimento) {
    if (!dataNascimento) return undefined;
    const d = new Date(dataNascimento);
    if (Number.isNaN(d.getTime())) return undefined;
    const today = new Date();
    let age = today.getFullYear() - d.getFullYear();
    const m = today.getMonth() - d.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < d.getDate())) {
      age--;
    }
    return age;
  }

  // helper robusto para extrair o id do paciente de diferentes formatos
  function getPacienteId(p) {
    if (!p) return null;
    return (
      p.id ??
      p.idPaciente ??           // suporta resposta contendo idPaciente
      p.pacienteId ??
      p.PacienteId ??
      p.patientId ??
      (p.paciente && (p.paciente.id ?? p.paciente.pacienteId)) ??
      null
    );
  }

  useEffect(() => {
    let mounted = true;
    setPacientesLoading(true);
    setPacientesError(null);
    pacienteService.getPacientes()
      .then((data) => {
        if (!mounted) return;
        const list = Array.isArray(data)
          ? data.map((p) => {
              const idade = calculateAge(p.dataNascimento ?? p.dataNascimentoISO ?? p.nascimento);
              // normaliza id para facilitar uso (usa idPaciente quando disponível)
              const id = p.id ?? p.idPaciente ?? p.pacienteId ?? p.PacienteId ?? null;
              return { ...p, idade, id };
            })
          : [];
        setPacientes(list);
      })
      .catch((err) => {
        if (!mounted) return;
        console.error("Erro ao carregar pacientes:", err);
        setPacientes([]);
        setPacientesError(String(err?.message || err));
      })
      .finally(() => {
        if (!mounted) return;
        setPacientesLoading(false);
      });
    return () => { mounted = false; };
  }, []);

  function abrirConsulta(consultaId) {
    // Só aqui entra na tela de realizar consulta
    navigate(`/medico/consulta/${consultaId}`);
  }

  function abrirProntuarioEmModal(pacienteId) {
    setModalPacienteId(pacienteId);
    setModalProntuarioOpen(true);
  }

  function fecharModalProntuario() {
    setModalProntuarioOpen(false);
    setModalPacienteId(null);
  }

  function renderConteudo() {
    switch (abaAtiva) {
      case "consultas":
        // Fila de consultas, só entra na consulta ao clicar em Atender
        return (
          <ConsultasMedico
            consultas={consultasDoDia}
            onAtender={abrirConsulta}
            pacientes={pacientes}
          />
        );

      case "pacientes":
        return (
          <section className="card">
            <h2 className="card-title">Pacientes</h2>
            <div className="card-body">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <input
                  type="text"
                  placeholder="Buscar paciente por nome ou CPF..."
                  className="input-inline"
                />
              </div>
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
                   {pacientesLoading ? (
                     <tr><td colSpan={5}>Carregando pacientes...</td></tr>
                   ) : pacientesError ? (
                     <tr><td colSpan={5}>Erro: {pacientesError}</td></tr>
                   ) : pacientes.length === 0 ? (
                     <tr><td colSpan={5}>Nenhum paciente encontrado.</td></tr>
                   ) : (
                     patientsRender()
                   )}
                 </tbody>
               </table>
             </div>
           </section>
         );

      default:
        return null;
    }
  }

  function patientsRender() {
    return pacientes.map((p) => {
      const pid = getPacienteId(p);
      return (
        <tr key={pid ?? JSON.stringify(p)}>
          <td>{p.nome ?? p.nomeCompleto ?? p.pacienteNome}</td>
          <td>{p.idade ?? ""}</td>
          <td>{p.sexo ?? ""}</td>
          <td>{p.cpf ?? ""}</td>
          <td>
            <button
              className="btn btn-outline"
              onClick={() => {
                if (!pid) {
                  console.warn("Paciente sem id válido:", p);
                  return;
                }
                abrirProntuarioEmModal(pid);
              }}
              disabled={!pid}
              title={!pid ? "ID do paciente indisponível" : "Ver prontuário"}
            >
              Ver prontuário
            </button>
          </td>
        </tr>
      );
    });
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
          <p className="texto-muted medico-subtitle" style={{ color: "#000" }}>
            Acompanhe suas consultas e pacientes em um só lugar.
          </p>
        </div>
        <button
          className="btn medico-btn-sair"
          onClick={() => navigate("/login")}
          style={{ background: "#ffffff", color: "#4da6ff", border: "2px solid #ADD8E6" }}
        >
          Sair
        </button>
      </header>

      {/* MENU HORIZONTAL */}
      <nav className="medico-nav">
        <button
          className={abaAtiva === "consultas" ? "medico-nav-link active" : "medico-nav-link"}
          onClick={() => setAbaAtiva("consultas")}
        >
          Consultas
        </button>
        <button
          className={abaAtiva === "pacientes" ? "medico-nav-link active" : "medico-nav-link"}
          onClick={() => setAbaAtiva("pacientes")}
        >
          Pacientes
        </button>
      </nav>

      {/* CONTEÚDO DA ABA */}
      <main className="medico-main">{renderConteudo()}</main>

      {/* Modal simples para prontuário */}
      {modalProntuarioOpen && (
        <div
          className="modal-overlay"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: 16,
          }}
          onClick={fecharModalProntuario}
        >
          <div
            className="modal-content"
            style={{ background: "#f5f7fb", borderRadius: 8, padding: 16, maxWidth: 900, width: "100%" }}
            onClick={(e) => e.stopPropagation()}
          >
            <Prontuario pacienteId={modalPacienteId} onClose={fecharModalProntuario} />
          </div>
        </div>
      )}
    </div>
  );
}
