// src/pages/Medico/Prontuario.jsx
import { useEffect, useState } from "react";
import { getExamesPorPaciente, getExameArquivo } from "../../services/medicoExameService";

// Componente enxuto: recebe pacienteId e onClose. Renderiza só os cards de exames.
export default function Prontuario({ pacienteId, onClose }) {
  const [exames, setExames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingIds, setLoadingIds] = useState([]); // ids de exames sendo abertos
  const [erro, setErro] = useState(null);

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
    </div>
  );
}
