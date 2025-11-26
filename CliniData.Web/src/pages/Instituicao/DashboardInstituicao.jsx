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
import consultaService from "../../services/consultaService";
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

  // CONSULTAS (novo estado)
  const [consultas, setConsultas] = useState([]);
  const [consultasLoading, setConsultasLoading] = useState(false);
  const [consultasError, setConsultasError] = useState(null);

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

  // normaliza dados da consulta, incluindo paciente, médico e instituição
  function normalizeConsultaObject(c) {
    if (!c || typeof c !== "object") return null;
    const idConsulta = c.idConsulta ?? c.id;
    const paciente = c.paciente ?? {};
    const medico = c.medico ?? {};
    const instituicao = c.instituicao ?? {};
    return {
      idConsulta,
      dataHora: c.dataHora ? new Date(c.dataHora).toISOString() : null,
      pacienteId: paciente.id ?? paciente.idPaciente ?? null,
      pacienteNome: paciente.nome ?? `#${paciente.id}`,
      medicoId: medico.id ?? medico.idMedico ?? null,
      medicoNome: medico.nome ?? `#${medico.id}`,
      instituicaoId: instituicao.id ?? instituicao.idInstituicao ?? null,
      instituicaoNome: instituicao.nome ?? `#${instituicao.id}`,
      observacao: c.observacao ?? "",
    };
  }

  // normaliza arrays de consultas antes de armazenar no state
  function normalizeConsultasArray(arr) {
    if (!Array.isArray(arr)) return [];
    return arr
      .map(normalizeConsultaObject)
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

  // calcula a idade a partir da data de nascimento (formato ISO)
  function calculateAge(dataNascimento) {
    if (!dataNascimento) return "";
    const d = new Date(dataNascimento);
    if (isNaN(d.getTime())) return "";
    const today = new Date();
    let age = today.getFullYear() - d.getFullYear();
    const m = today.getMonth() - d.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < d.getDate())) age--;
    return age;
  }

  async function loadConsultas() {
    setConsultasLoading(true);
    setConsultasError(null);
    try {
      const data = await consultaService.getConsultas();
      setConsultas(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Erro ao carregar consultas:", err);
      setConsultas([]);
      setConsultasError(String(err?.message || err));
    } finally {
      setConsultasLoading(false);
    }
  }

  useEffect(() => {
    // carrega apenas quando a aba consultas for ativada e ainda não há dados
    if (abaAtiva === "consultas" && consultas.length === 0 && !consultasLoading) {
      loadConsultas();
    }
  }, [abaAtiva]); // reexecutar quando abaAtiva mudar

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
    // estado de exibição
    if (consultasLoading) {
      return (
        <section className="inst-section-card">
          <div className="inst-section-header">
            <h2>Agenda e Consultas</h2>
            <button className="btn-primario" disabled>Carregando...</button>
          </div>
          <p>Carregando consultas...</p>
        </section>
      );
    }
    if (consultasError) {
      return (
        <section className="inst-section-card">
          <div className="inst-section-header">
            <h2>Agenda e Consultas</h2>
            {/* botão removido */}
          </div>
          <p style={{ color: "#dc2626" }}>Erro: {consultasError}</p>
        </section>
      );
    }
    const temConsultas = consultas && consultas.length > 0;
    return (
      <section className="inst-section-card">
        <div className="inst-section-header">
          <h2>Agenda e Consultas</h2>
          <button className="btn-primario" onClick={loadConsultas}>Recarregar</button>
        </div>
        {!temConsultas ? (
          <p>Nenhuma consulta encontrada.</p>
        ) : (
          <table className="inst-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Data / Hora</th>
                <th>Paciente</th>
                <th>Médico</th>
                <th>Instituição</th>
                <th>Observação</th>
              </tr>
            </thead>
            <tbody>
              {consultas.map((c) => {
                const idConsulta = c.idConsulta ?? c.id;
                const paciente = c.paciente ?? {};
                const medico = c.medico ?? {};
                const instituicao = c.instituicao ?? {};
                const pacienteNome = paciente.nome ?? c.pacienteNome ?? `#${c.pacienteId ?? ""}`;
                const pacienteAge = calculateAge(paciente.dataNascimento);
                const pacienteCpf = paciente.cpf;
                const medicoNome = medico.nome ?? `#${c.medicoId ?? ""}`;
                const medicoCrm = medico.crm;
                const instituicaoNome = instituicao.nome ?? `#${c.instituicaoId ?? ""}`;
                return (
                  <tr key={idConsulta}>
                    <td>{idConsulta}</td>
                    <td>{c.dataHora ? new Date(c.dataHora).toLocaleString() : (c.dataHora ?? "")}</td>
                    <td>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span>{pacienteNome}{pacienteAge ? ` • ${pacienteAge} anos` : ""}</span>
                        {pacienteCpf ? <small className="texto-muted">{pacienteCpf}</small> : null}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span>{medicoNome}</span>
                        {medicoCrm ? <small className="texto-muted">CRM: {medicoCrm}</small> : null}
                      </div>
                    </td>
                    <td>{instituicaoNome}</td>
                    <td style={{ maxWidth: 250, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {c.observacao ?? ""}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </section>
    );
  }

  function renderConteudo() {
    switch (abaAtiva) {
      case "medicos":
        return renderMedicos();
      case "consultas":
        return renderConsultas();
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
