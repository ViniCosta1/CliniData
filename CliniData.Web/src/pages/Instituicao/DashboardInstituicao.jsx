import { useState, useEffect, useRef } from "react";
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
import instituicaoService from "../../services/instituicaoService";
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

  const [medicos, setMedicos] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [medicosDisponiveis, setMedicosDisponiveis] = useState([]);
  const [selectedMedicoId, setSelectedMedicoId] = useState("");

  // Novo: id do médico que está sendo removido (ou null)
  const [removingId, setRemovingId] = useState(null);

  // Estado/modal para confirmação de exclusão
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [confirmMedico, setConfirmMedico] = useState(null);

  // Novo estado/ref para modal de sucesso
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const timerRef = useRef(null);

  // helper: normaliza um objeto médico garantindo propriedade `id` (number) e campos úteis
  function normalizeMedicoObject(m) {
    if (!m || typeof m !== "object") return null;
    const rawId = m.id ?? m.idMedico ?? m.medicoId ?? (m.medico && m.medico.id);
    const id = rawId == null ? null : Number(rawId);
    const nome = m.nome ?? m.nomeCompleto ?? (m.medico && m.medico.nome) ?? "";
    const esp = m.esp ?? m.especialidade ?? m.especialidadeDescricao ?? "";
    const crm = m.crm ?? m.CRM ?? "";
    const ativo = m.ativo ?? m.isActive ?? true;
    return { ...m, id, nome, esp, crm, ativo };
  }

  // normaliza arrays de médicos antes de armazenar no state
  function normalizeMedicosArray(arr) {
    if (!Array.isArray(arr)) return [];
    return arr
      .map(normalizeMedicoObject)
      .filter(Boolean);
  }

  useEffect(() => {
    let mounted = true;
    instituicaoService
      .getMedicosPorInstituicao()
      .then((data) => {
        if (!mounted) return;
        setMedicos(normalizeMedicosArray(data));
      })
      .catch((err) => {
        console.error("Erro ao carregar médicos da instituição:", err);
      });
    return () => {
      mounted = false;
      // cleanup do timer de sucesso, se existir
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []); // executar apenas uma vez

  async function openCadastroModal() {
    try {
      const lista = await instituicaoService.getMedicos();
      console.log("getMedicos() retornou:", lista);
      const arrRaw = Array.isArray(lista) ? lista : [];
      // normaliza incluindo idMedico (formato da sua API)
      const arr = arrRaw
        .map((m) => {
          const id = m.id ?? m.idMedico ?? m.medicoId ?? (m.medico && m.medico.id);
          const nome = m.nome ?? m.nomeCompleto ?? (m.medico && m.medico.nome) ?? "";
          const esp = m.esp ?? m.especialidade ?? m.especialidadeDescricao ?? "";
          const crm = m.crm ?? m.CRM ?? "";
          return id ? { id, nome, esp, crm } : null;
        })
        .filter(Boolean);
      setMedicosDisponiveis(arr);
      setSelectedMedicoId(arr.length ? String(arr[0].id) : "");
      setModalOpen(true);
    } catch (err) {
      console.error("Erro ao buscar médicos disponíveis:", err);
    }
  }

  function closeModal() {
    setModalOpen(false);
    setMedicosDisponiveis([]);
    setSelectedMedicoId("");
  }

  // Substituir a função submitAdicionarMedico por versão que atualiza a tabela após cadastro
  async function submitAdicionarMedico(e) {
    e.preventDefault();

    const medicoIdNum = Number(selectedMedicoId);
    if (!selectedMedicoId || Number.isNaN(medicoIdNum)) {
      console.error("medicoId inválido:", selectedMedicoId);
      return;
    }

    try {
      const payload = { medicoId: medicoIdNum, idMedico: medicoIdNum };
      console.log("Enviando payload adicionarMedicoInstituicao:", payload);

      await instituicaoService.adicionarMedicoInstituicao(payload);

      // atualizar lista de médicos e fechar modal só após sucesso
      try {
        const dados = await instituicaoService.getMedicosPorInstituicao();
        setMedicos(normalizeMedicosArray(dados));
      } catch (fetchErr) {
        console.error("Erro ao buscar médicos após adicionar:", fetchErr);
      }

      closeModal();
    } catch (err) {
      console.error("Erro ao adicionar médico à instituição:", err);
    } finally {
      // limpa seleção local (opcional)
      setMedicosDisponiveis([]);
      setSelectedMedicoId("");
    }
  }

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

  function openConfirmRemover(medico) {
    setConfirmMedico(medico);
    setConfirmModalOpen(true);
  }

  // Função que executa a remoção após confirmação
  async function handleRemoverMedico(medicoId) {
    // garante id numérico válido (caso venha undefined/nulo)
    const idNum = Number(medicoId);
    try {
      setRemovingId(idNum);
      await instituicaoService.removerMedicoInstituicao({ medicoId: idNum });
      const dados = await instituicaoService.getMedicosPorInstituicao();
      setMedicos(normalizeMedicosArray(dados));
    } catch (err) {
      console.error("Erro ao remover médico:", err);
    } finally {
      setRemovingId(null);
    }
  }

  async function confirmRemover() {
    if (!confirmMedico) return;
    // usa campo id normalizado se disponível, senão tenta outras chaves
    const confirmedId =
      confirmMedico.id ??
      confirmMedico.idMedico ??
      confirmMedico.medicoId ??
      (confirmMedico.medico && confirmMedico.medico.id);
    setConfirmModalOpen(false);
    await handleRemoverMedico(confirmedId);
    setConfirmMedico(null);
  }

  function cancelRemover() {
    setConfirmMedico(null);
    setConfirmModalOpen(false);
  }

  function renderMedicos() {
    return (
      <section className="inst-section-card">
        <div className="inst-section-header">
          <h2>Médicos da Instituição</h2>
          <button className="btn-primario" onClick={openCadastroModal}>Cadastrar novo médico</button>
        </div>

        <table className="inst-table">
          <thead>
            <tr><th>Nome</th><th>CRM</th><th></th></tr>
          </thead>
          <tbody>
            {medicos.map((m, idx) => (
              <tr key={m.id ?? m.idMedico ?? m.medicoId ?? `med-${idx}`}>
                <td>{m.nome}</td>
                <td>{m.crm}</td>
                <td>
                  {/* botão de exclusão (mantido) */}
                  <button
                    onClick={() => openConfirmRemover(normalizeMedicoObject(m))}
                    disabled={removingId === (m.id ?? m.idMedico ?? m.medicoId)}
                    aria-label="Excluir médico"
                    title="Excluir"
                    style={{
                      marginLeft: 8,
                      backgroundColor: '#ef4444',
                      color: '#fff',
                      padding: 6,
                      borderRadius: 6,
                      border: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 34,
                      height: 34,
                      cursor: 'pointer',
                      fontSize: 14,
                    }}
                  >
                    {removingId === (m.id ?? m.idMedico ?? m.medicoId) ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 50 50" fill="none">
                        <circle cx="25" cy="25" r="20" stroke="#fff" strokeWidth="4" strokeOpacity="0.2" />
                        <path d="M45 25a20 20 0 0 1-20 20" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                        <path d="M10 11v6" />
                        <path d="M14 11v6" />
                        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                      </svg>
                    )}
                  </button>
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
            <tr><th>Data</th><th>Hora</th><th>Paciente</th><th>Médico</th><th>Status</th></tr>
          </thead>
          <tbody>
            {consultasMock.map((c, idx) => (
              <tr key={c.id ?? `cons-${idx}`}>
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
            <tr><th>Nome</th><th>Data de nascimento</th><th>Documento</th><th></th></tr>
          </thead>
          <tbody>
            {pacientesMock.map((p, idx) => (
              <tr key={p.id ?? `pac-${idx}`}>
                <td>{p.nome}</td>
                <td>{p.nasc}</td>
                <td>{p.doc}</td>
                <td>
                  <button className="btn-secundario btn-sm">Ver histórico completo</button>
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
            <tr><th>Material / Medicamento</th><th>Qtd. usada (mês)</th><th>Custo total (R$)</th></tr>
          </thead>
          <tbody>
            {materiaisMock.map((mat, idx) => (
              <tr key={mat.id ?? `mat-${idx}`}>
                <td>{mat.nome}</td>
                <td>{mat.qtdUsadaMes}</td>
                <td>
                  R{" "}
                  {mat.custoTotal.toLocaleString("pt-BR", {
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

      {/* Modal de cadastro de médico */}
      {modalOpen && (
        <div className="modal-overlay" style={{ zIndex: 1000 }}>
          <div className="modal-card">
            <h3>Adicionar médico à instituição</h3>
            <form onSubmit={submitAdicionarMedico}>
              <label>
                Médico
                <select
                  value={selectedMedicoId}
                  onChange={(e) => setSelectedMedicoId(e.target.value)}
                  required
                >
                  <option value="" disabled>
                    Selecione...
                  </option>
                  {medicosDisponiveis.map((opt, idx) => (
                    <option key={opt.id ?? `opt-${idx}`} value={String(opt.id)}>
                      {opt.nome} {opt.esp ? `- ${opt.esp}` : ""} {opt.crm ? `(${opt.crm})` : ""}
                    </option>
                  ))}
                </select>
              </label>
              <div className="modal-actions">
                <button type="submit" className="btn-primario">Cadastrar</button>
                <button type="button" className="btn-secundario" onClick={closeModal}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de confirmação de exclusão */}
      {confirmModalOpen && confirmMedico && (
        <div className="modal-overlay" style={{ zIndex: 9999 }}>
          <div className="modal-card">
            <h3>Confirmar exclusão</h3>
            <p>Deseja remover <strong>{confirmMedico.nome}</strong> da instituição?</p>
            <div className="modal-actions">
              <button className="btn-danger" onClick={confirmRemover}>Sim</button>
              <button className="btn-secundario" onClick={cancelRemover}>Não</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de sucesso exibido por 1s após cadastro.
          inline zIndex alto para evitar ser oculto por estilos existentes */}
      {successModalOpen && (
        <div className="modal-overlay" style={{ zIndex: 9999 }}>
          <div className="modal-card">
            <h3>{successMessage}</h3>
            <p>Atualizando lista...</p>
          </div>
        </div>
      )}
    </div>
  );
}
