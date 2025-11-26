// src/pages/Medico/Prontuario.jsx
import { useEffect, useState } from "react";
import { getExamesPorPaciente, getExameArquivo } from "../../services/medicoExameService";
import consultaService from "../../services/consultaService";

// Componente enxuto: recebe pacienteId e onClose. Renderiza só os cards de exames.
export default function Prontuario({ pacienteId, onClose }) {
  const [exames, setExames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingIds, setLoadingIds] = useState([]); // ids de exames sendo abertos
  const [erro, setErro] = useState(null);
  const [consultas, setConsultas] = useState([]);
  const [consultasLoading, setConsultasLoading] = useState(false);
  const [consultasErro, setConsultasErro] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function carregar() {
      try {
        setLoading(true);
        setErro(null);
        const resp = await getExamesPorPaciente(pacienteId);
        if (!mounted) return;
        setExames(Array.isArray(resp) ? resp : []);
      } catch (e) {
        console.error(e);
        if (!mounted) return;
        setErro("Não foi possível carregar exames.");
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    }
    carregar();
    // busca consultas (todas) e filtra por pacienteId
    (async function carregarConsultas() {
      let mountedC = true;
      try {
        setConsultasLoading(true);
        setConsultasErro(null);
        const all = await consultaService.getConsultas();
        if (!mountedC) return;
        const arr = Array.isArray(all) ? all : [];
        // filtra considerando várias possíveis chaves (pacienteId ou paciente.idPaciente)
        const filtradas = arr.filter((c) => {
          const pid = pacienteId ?? String(pacienteId);
          const pac = c?.paciente ?? {};
          const cid1 = String(c.pacienteId ?? c.paciente?.id ?? c.paciente?.idPaciente ?? "");
          // compara como string para evitar problemas de tipos
          return pid != null && (String(pid) === cid1 || String(pid) === String(c.pacienteId));
        });
        setConsultas(filtradas);
      } catch (err) {
        console.error("Erro ao carregar consultas:", err);
        if (mountedC) setConsultasErro("Não foi possível carregar consultas.");
      } finally {
        if (mountedC) setConsultasLoading(false);
      }
      return () => (mountedC = false);
    })();
    return () => (mounted = false);
  }, [pacienteId]);

  function markLoading(id, flag) {
    setLoadingIds((prev) => {
      if (flag) {
        if (prev.includes(id)) return prev;
        return [...prev, id];
      } else {
        return prev.filter((x) => x !== id);
      }
    });
  }

  async function abrirArquivo(exame) {
    const id = exame?.id;
    if (!id) return;
    try {
      markLoading(id, true);
      const blob = await getExameArquivo(id);
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
      setTimeout(() => URL.revokeObjectURL(url), 60_000);
    } catch (e) {
      console.error(e);
      setErro("Erro ao abrir arquivo do exame.");
    } finally {
      markLoading(id, false);
    }
  }

  return (
    <div className="prontuario-cards-root" style={{ minWidth: 320 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <h3 style={{ margin: 0 }}>Exames do paciente</h3>
        <div>
          <button className="btn btn-outline" onClick={onClose}>Fechar</button>
        </div>
      </div>

      {loading ? (
        <div>Carregando exames...</div>
      ) : erro ? (
        <div className="texto-muted erro">{erro}</div>
      ) : exames.length === 0 ? (
        <div className="texto-muted">Nenhum exame registrado para este paciente.</div>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {exames.map((ex) => (
            <li key={ex.id} style={{ marginBottom: 12 }}>
              <div
                style={{
                  background: "#fff",
                  borderRadius: 8,
                  padding: 12,
                  boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <strong>{ex.tipoExame}</strong>
                    <div style={{ fontSize: 12, color: "#666" }}>
                      {ex.dataHora ? new Date(ex.dataHora).toLocaleString() : ""}
                      {ex.instituicao ? ` • ${ex.instituicao}` : ""}
                    </div>
                    <p style={{ margin: "8px 0 0", fontSize: 13 }}>{ex.observacao || ex.resultado || "Sem resumo"}</p>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end" }}>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline"
                      onClick={() => abrirArquivo(ex)}
                      disabled={loadingIds.includes(ex.id)}
                    >
                      {loadingIds.includes(ex.id) ? "Abrindo..." : "Abrir"}
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Consultas relacionadas ao paciente */}
      <div style={{ marginTop: 20 }}>
        <h4 style={{ marginBottom: 8 }}>Consultas relacionadas</h4>
        {consultasLoading ? (
          <div>Carregando consultas...</div>
        ) : consultasErro ? (
          <div className="texto-muted erro">{consultasErro}</div>
        ) : consultas.length === 0 ? (
          <div className="texto-muted">Nenhuma consulta encontrada para este paciente.</div>
        ) : (
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {consultas.map((c) => {
              const id = c.idConsulta ?? c.id;
              const dataHora = c.dataHora ? new Date(c.dataHora).toLocaleString() : "";
              const medicoNome = c.medico?.nome ?? (c.medicoNome ?? "");
              const instituicaoNome = c.instituicao?.nome ?? (c.instituicaoNome ?? "");
              return (
                <li key={id} style={{ marginBottom: 10 }}>
                  <div style={{ background: "#fff", borderRadius: 8, padding: 10, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <strong>{dataHora}</strong>
                        <div style={{ fontSize: 13, color: "#444" }}>
                          {medicoNome && <span>{medicoNome}{instituicaoNome ? ` • ${instituicaoNome}` : ""}</span>}
                        </div>
                        <div style={{ marginTop: 6, fontSize: 13 }}>{c.observacao ?? ""}</div>
                      </div>
                      <div style={{ marginLeft: 12, textAlign: "right" }}>
                        <small className="texto-muted">ID: {id}</small>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
