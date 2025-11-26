import { useState, useMemo, useEffect } from "react";
import consultaService from "../../services/consultaService";
import instituicaoService from "../../services/instituicaoService";

export default function ConsultasMedico({ consultas, onAtender, pacientes: pacientesProp, instituicoes: instituicoesProp, onCriarConsulta }) {
  const temConsultas = consultas && consultas.length > 0;

  // estados para modal de criação de consulta
  const [consultaModalOpen, setConsultaModalOpen] = useState(false);
  const [dataHora, setDataHora] = useState("");
  const [pacienteId, setPacienteId] = useState("");
  const [instituicaoId, setInstituicaoId] = useState("");
  const [observacao, setObservacao] = useState("");

  // derive lista de pacientes se não fornecida via props
  const pacientesList = useMemo(() => {
    if (Array.isArray(pacientesProp) && pacientesProp.length) return pacientesProp;
    const dedup = new Map();
    (consultas || []).forEach((c) => {
      if (c.pacienteId || c.pacienteNome) {
        const id = c.pacienteId ?? c.id ?? c.pacienteNome;
        if (!dedup.has(id)) dedup.set(id, { id, nome: c.pacienteNome ?? `Paciente ${id}` });
      }
    });
    return Array.from(dedup.values());
  }, [consultas, pacientesProp]);

  // instituições carregadas da API (ou fallback via props)
  const [instituicoesList, setInstituicoesList] = useState(Array.isArray(instituicoesProp) ? instituicoesProp : []);

  useEffect(() => {
    let mounted = true;
    // se props não trouxer instituições, buscar da API
    if (!instituicoesProp) {
      instituicaoService.getInstituicoes()
        .then((data) => {
          if (!mounted) return;
          setInstituicoesList(Array.isArray(data) ? data : []);
        })
        .catch((err) => {
          console.error("Erro ao carregar instituições:", err);
          setInstituicoesList([]);
        });
    }
    return () => { mounted = false; };
  }, [instituicoesProp]);

  function openConsultaModal() {
    setDataHora(new Date().toISOString().slice(0,16)); // yyyy-MM-ddTHH:mm
    setPacienteId(pacientesList.length ? String(pacientesList[0].id) : "");
    setInstituicaoId(instituicoesList.length ? String(instituicoesList[0].id) : "");
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
          <table className="tabela-simples">
            <thead>
              <tr>
                <th>Horário</th>
                <th>Paciente</th>
                <th>Motivo</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {consultas.map((c) => (
                <tr key={c.id}>
                  <td>{c.horario}</td>
                  <td>{c.pacienteNome}</td>
                  <td>{c.motivo}</td>
                  <td>{c.status}</td>
                  <td>
                    <button
                      className="btn btn-primary"
                      onClick={() => onAtender(c.id)}
                    >
                      Atender
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {/* botão para abrir modal de criação */}
        <div style={{ marginTop: 12 }}>
          <button className="btn btn-primario" onClick={openConsultaModal}>Agendar nova consulta</button>
        </div>

        {/* Modal de criação de consulta */}
        {consultaModalOpen && (
          <div className="modal-overlay" style={{ zIndex: 9999 }}>
            <div className="modal-card">
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
                      <option key={p.id} value={String(p.id)}>{p.nome}</option>
                    ))}
                  </select>
                </label>

                <label>
                  Instituição
                  <select value={instituicaoId} onChange={(e) => setInstituicaoId(e.target.value)} required>
                    {instituicoesList.map((i, idx) => (
                      <option key={i.id ?? `inst-${idx}`} value={String(i.id)}>{i.nome ?? i.descricao ?? `Instituição ${i.id}`}</option>
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
