import { useState, useMemo, useEffect, useCallback } from "react";
import consultaService from "../../services/consultaService";
import instituicaoService from "../../services/instituicaoService";
import pacienteService from "../../services/pacienteService";

export default function ConsultasMedico({ consultas, pacientes: pacientesProp, instituicoes: instituicoesProp, onCriarConsulta }) {
  // estado local para consultas quando não fornecidas via props
  const [apiConsultas, setApiConsultas] = useState([]);
  const [consultasLoading, setConsultasLoading] = useState(false);
  const [consultasError, setConsultasError] = useState(null);

  const loadConsultas = useCallback(async () => {
    setConsultasLoading(true);
    setConsultasError(null);
    try {
      const data = await consultaService.getConsultas();
      setApiConsultas(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Erro ao carregar consultas:", err);
      setApiConsultas([]);
      setConsultasError(String(err?.message || err));
    } finally {
      setConsultasLoading(false);
    }
  }, []);

  useEffect(() => {
      loadConsultas();
  }, [consultas]);

  const displayedConsultas = apiConsultas;
  const temConsultas = displayedConsultas && displayedConsultas.length > 0;

  // estados para modal de criação de consulta
  const [consultaModalOpen, setConsultaModalOpen] = useState(false);
  const [dataHora, setDataHora] = useState("");
  const [pacienteId, setPacienteId] = useState("");
  const [instituicaoId, setInstituicaoId] = useState("");
  const [observacao, setObservacao] = useState("");

  // helper: normaliza objeto paciente garantindo { id: number, nome: string }
  function normalizePacienteObject(p) {
    if (!p || typeof p !== "object") return null;
    const rawId = p.id ?? p.pacienteId ?? p.idPaciente ?? p.idPacienteCadastro;
    const id = rawId == null ? null : Number(rawId);
    const nome = p.nome ?? p.nomeCompleto ?? p.pacienteNome ?? p.fullName ?? "";
    return id ? { ...p, id, nome } : null;
  }

  // pacientes carregados da API (ou via props) — armazenamos normalizados
  const [apiPacientes, setApiPacientes] = useState(
    Array.isArray(pacientesProp) ? pacientesProp.map(normalizePacienteObject).filter(Boolean) : []
  );

  useEffect(() => {
    let mounted = true;
    if (!pacientesProp) {
      pacienteService.getPacientes()
        .then((data) => {
          if (!mounted) return;
          const arr = Array.isArray(data) ? data.map(normalizePacienteObject).filter(Boolean) : [];
          setApiPacientes(arr);
        })
        .catch((err) => {
          console.error("Erro ao carregar pacientes:", err);
          setApiPacientes([]);
        });
    } else {
      setApiPacientes(Array.isArray(pacientesProp) ? pacientesProp.map(normalizePacienteObject).filter(Boolean) : []);
    }
    return () => { mounted = false; };
  }, [pacientesProp]);

  // derive lista de pacientes se não fornecida via props
  const pacientesList = useMemo(() => {
    if (Array.isArray(pacientesProp) && pacientesProp.length) return pacientesProp.map(normalizePacienteObject).filter(Boolean);
    if (Array.isArray(apiPacientes) && apiPacientes.length) return apiPacientes;
    const dedup = new Map();
    (consultas || []).forEach((c) => {
      if (c.pacienteId || c.pacienteNome) {
        const id = c.pacienteId ?? c.id ?? c.pacienteNome;
        if (!dedup.has(id)) dedup.set(id, { id, nome: c.pacienteNome ?? `Paciente ${id}` });
      }
    });
    return Array.from(dedup.values());
  }, [consultas, pacientesProp, apiPacientes]);

  // helper: normaliza objeto instituição garantindo { id: number, nome: string }
  function normalizeInstituicaoObject(i) {
    if (!i || typeof i !== "object") return null;
    // sua API retorna idInstituicao e nome
    const rawId = i.idInstituicao ?? i.id ?? i.instituicaoId ?? i.instituicao?.id;
    const id = rawId == null ? null : Number(rawId);
    const nome = i.nome ?? i.descricao ?? i.razaoSocial ?? i.nomeFantasia ?? "";
    return id ? { id, nome } : null;
  }

  // helper: calcula idade a partir de dataNascimento (ISO string)
  function calculateAge(dataNascimento) {
    if (!dataNascimento) return undefined;
    const d = new Date(dataNascimento);
    if (Number.isNaN(d.getTime())) return undefined;
    const today = new Date();
    let age = today.getFullYear() - d.getFullYear();
    const m = today.getMonth() - d.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < d.getDate())) age--;
    return age;
  }

  // instituições carregadas da API (normalizadas) — mesma lógica que usamos para pacientes
  const [apiInstituicoes, setApiInstituicoes] = useState(
    Array.isArray(instituicoesProp) ? instituicoesProp.map(normalizeInstituicaoObject).filter(Boolean) : []
  );

  useEffect(() => {
    let mounted = true;
    if (!instituicoesProp) {
      instituicaoService.getInstituicoes()
        .then((data) => {
          if (!mounted) return;
          const arr = Array.isArray(data) ? data.map(normalizeInstituicaoObject).filter(Boolean) : [];
          // arr agora contém objetos { id, nome } baseados em idInstituicao/nome
          setApiInstituicoes(arr);
        })
        .catch((err) => {
          console.error("Erro ao carregar instituições:", err);
          setApiInstituicoes([]);
        });
    } else {
      setApiInstituicoes(Array.isArray(instituicoesProp) ? instituicoesProp.map(normalizeInstituicaoObject).filter(Boolean) : []);
    }
    return () => { mounted = false; };
  }, [instituicoesProp]);

  // derive lista de instituições (props > api > fallback)
  const instituicoesList = useMemo(() => {
    if (Array.isArray(instituicoesProp) && instituicoesProp.length) return instituicoesProp.map(normalizeInstituicaoObject).filter(Boolean);
    if (Array.isArray(apiInstituicoes) && apiInstituicoes.length) return apiInstituicoes;
    return [];
  }, [instituicoesProp, apiInstituicoes]);

  // quando modal abrir ou listas mudarem, garante que o select controlado tenha um value válido
  useEffect(() => {
    if (!consultaModalOpen) return;
    
    // define valor padrão apenas se ainda não houver seleção (não sobrescreve escolha do usuário)
    if (!pacienteId && pacientesList.length) {
      setPacienteId(String(pacientesList[0].id));
    }
    if (!instituicaoId && instituicoesList.length) {
      setInstituicaoId(String(instituicoesList[0].id));
    }
    // NOTA: não incluímos pacienteId/instituicaoId nas dependências
    // para evitar sobrescrever a seleção do usuário quando estes mudarem.
  }, [consultaModalOpen, pacientesList, instituicoesList]);

  // torna assíncrono: se não houver instituições carregadas, tenta buscar antes de abrir o modal
  async function openConsultaModal() {
    setDataHora(new Date().toISOString().slice(0,16)); // yyyy-MM-ddTHH:mm
    // se a lista de instituições estiver vazia, tenta recarregar (evita modal sem opções)
    if (!instituicoesList || instituicoesList.length === 0) {
      try {
        const raw = await instituicaoService.getInstituicoes();
        const arr = Array.isArray(raw) ? raw.map(normalizeInstituicaoObject).filter(Boolean) : [];
        setApiInstituicoes(arr);
        // atualiza instituicoesList derivado (useMemo) irá refletir arr; mas usamos arr direto aqui para inicializar
        if (!instituicaoId && arr.length) {
          setInstituicaoId(String(arr[0].id));
        }
        console.debug("Instituições carregadas ao abrir modal:", arr);
      } catch (err) {
        console.error("Erro ao carregar instituições ao abrir modal:", err);
      }
    } else {
      if (!instituicaoId && instituicoesList.length) {
        setInstituicaoId(String(instituicoesList[0].id));
      }
    }

    // inicializa paciente (se necessário)
    if (!pacienteId && pacientesList.length) {
      setPacienteId(String(pacientesList[0].id));
    }

    setObservacao("");
    setConsultaModalOpen(true);
  }

  function closeConsultaModal() {
    setConsultaModalOpen(false);
  }

  async function submitCriarConsulta(e) {
    e.preventDefault();
    try {
      const payload = {
        dataHora,
        pacienteId: Number(pacienteId),
        instituicaoId: Number(instituicaoId),
        observacao
      };
      await consultaService.criarConsulta(payload);
      // callback opcional para que o pai atualize a lista
      if (typeof onCriarConsulta === "function") onCriarConsulta();
      // recarrega quando este componente está consumindo a API diretamente
      try { await loadConsultas(); } catch { /* ignore */ }
      closeConsultaModal();
    } catch (err) {
      console.error("Erro ao criar consulta:", err);
    }
  }

  return (
    <section className="card">
      <h2 className="card-title">Consultas de hoje</h2>
      <div className="card-body">
        {!temConsultas ? (
          <p className="texto-muted">Nenhuma consulta agendada para hoje.</p>
        ) : (
          /* tabela atualizada para payload com objetos aninhados (paciente, medico, instituicao) */
          <table className="tabela-simples">
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
              {displayedConsultas.map((c) => {
                // usa explicitamente o formato do payload que você enviou
                const idConsulta = c.idConsulta ?? c.id;
                const paciente = c.paciente ?? {};
                const medico = c.medico ?? {};
                const instituicao = c.instituicao ?? {};

                const pacienteNome = paciente.nome ?? c.pacienteNome ?? `#${c.pacienteId ?? ""}`;
                const pacienteCpf = paciente.cpf ?? "";
                const pacienteIdDisplay = paciente.idPaciente ?? c.pacienteId ?? "";
                const pacienteIdade = calculateAge(paciente.dataNascimento) ?? "";

                const medicoNome = medico.nome ?? `#${c.medicoId ?? ""}`;
                const medicoCrm = medico.crm ?? "";
                const instituicaoNome = instituicao.nome ?? `#${c.instituicaoId ?? ""}`;
                return (
                  <tr key={idConsulta}>
                    <td>{idConsulta}</td>
                    <td>{c.dataHora ? new Date(c.dataHora).toLocaleString() : (c.dataHora ?? "")}</td>
                    <td>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span>{pacienteNome} {pacienteIdade !== "" ? `• ${pacienteIdade} anos` : ""}</span>
                        {pacienteCpf ? <small className="texto-muted">{pacienteCpf}</small> : null}
                        {pacienteIdDisplay ? <small className="texto-muted">ID: {pacienteIdDisplay}</small> : null}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span>{medicoNome}</span>
                        {medicoCrm ? <small className="texto-muted">CRM: {medicoCrm}</small> : null}
                      </div>
                    </td>
                    <td>{instituicaoNome}</td>
                    <td style={{ maxWidth: 300, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {c.observacao ?? ""}
                    </td>
                    {/* ação "Atender" removida */}
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
        {/* botão para abrir modal de criação */}
        <div style={{ marginTop: 12 }}>
          <button className="btn btn-primario" onClick={openConsultaModal}>Agendar nova consulta</button>
        </div>

        {/* Modal de criação de consulta */}
        {consultaModalOpen && (
          <div className="modal-overlay" style={{ zIndex: 9999, pointerEvents: 'auto' }}>
            <div className="modal-card" style={{ pointerEvents: 'auto' }}>
              <h3>Agendar nova consulta</h3>
              <form onSubmit={submitCriarConsulta}>
                <label>
                  Data e hora
                  <input type="datetime-local" value={dataHora} onChange={(e) => setDataHora(e.target.value)} required />
                </label>

                <label>
                  Paciente
                  <select value={pacienteId} onChange={(e) => setPacienteId(e.target.value)} required>
                    {pacientesList.map((p) => (
                      <option key={p.id ?? `p-${p.nome}`} value={String(p.id)}>{p.nome}</option>
                    ))}
                  </select>
                </label>

                <label>
                  Instituição
                  <select value={instituicaoId} onChange={(e) => setInstituicaoId(e.target.value)} required>
                    <option value="" disabled>Selecione...</option>
                    {instituicoesList.map((i, idx) => (
                      // i é { id, nome } após normalização
                      <option key={i.id ?? `inst-${idx}`} value={String(i.id)}>{i.nome}</option>
                    ))}
                  </select>
                </label>

                <label>
                  Observação
                  <textarea value={observacao} onChange={(e) => setObservacao(e.target.value)} rows={4} />
                </label>

                <div className="modal-actions">
                  <button type="submit" className="btn btn-primario">Salvar</button>
                  <button type="button" className="btn btn-secundario" onClick={closeConsultaModal}>Cancelar</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
