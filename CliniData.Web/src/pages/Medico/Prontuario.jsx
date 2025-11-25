// src/pages/Medico/Prontuario.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  buscarDetalhesPaciente,
  buscarProntuarioDaConsulta,
  salvarProntuarioDaConsulta,
  buscarConsultasAnteriores,
} from "../../services/medicoService";

export default function Prontuario() {
  const { pacienteId, consultaId } = useParams(); // ajuste de acordo com suas rotas
  const navigate = useNavigate();

  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState(null);

  const [paciente, setPaciente] = useState(null);
  const [consultasAnteriores, setConsultasAnteriores] = useState([]);

  const [form, setForm] = useState({
    queixaPrincipal: "",
    historiaDoencaAtual: "",
    antecedentes: "",
    medicacoesUso: "",
    alergias: "",
    exameFisico: "",
    hipotesesDiagnosticas: "",
    conduta: "",
  });

  useEffect(() => {
    async function carregarDados() {
      try {
        setCarregando(true);
        setErro(null);

        const [pacienteResp, prontuarioResp, consultasResp] = await Promise.all([
          buscarDetalhesPaciente(pacienteId),
          buscarProntuarioDaConsulta(consultaId),
          buscarConsultasAnteriores(pacienteId),
        ]);

        setPaciente(pacienteResp);

        if (prontuarioResp) {
          setForm({
            queixaPrincipal: prontuarioResp.queixaPrincipal ?? "",
            historiaDoencaAtual: prontuarioResp.historiaDoencaAtual ?? "",
            antecedentes: prontuarioResp.antecedentes ?? "",
            medicacoesUso: prontuarioResp.medicacoesUso ?? "",
            alergias: prontuarioResp.alergias ?? "",
            exameFisico: prontuarioResp.exameFisico ?? "",
            hipotesesDiagnosticas: prontuarioResp.hipotesesDiagnosticas ?? "",
            conduta: prontuarioResp.conduta ?? "",
          });
        }

        setConsultasAnteriores(consultasResp ?? []);
      } catch (e) {
        console.error(e);
        setErro("Não foi possível carregar os dados do prontuário.");
      } finally {
        setCarregando(false);
      }
    }

    if (pacienteId && consultaId) {
      carregarDados();
    }
  }, [pacienteId, consultaId]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSalvar(status = "rascunho") {
    try {
      setSalvando(true);
      setErro(null);

      await salvarProntuarioDaConsulta(consultaId, {
        ...form,
        status, // "rascunho" | "finalizado"
      });

      if (status === "finalizado") {
        navigate("/medico/dashboard");
      }
    } catch (e) {
      console.error(e);
      setErro("Erro ao salvar o prontuário. Tente novamente.");
    } finally {
      setSalvando(false);
    }
  }

  if (carregando) {
    return <div className="prontuario-page">Carregando prontuário...</div>;
  }

  if (erro) {
    return <div className="prontuario-page erro">{erro}</div>;
  }

  return (
    <div className="prontuario-page">
      {/* HEADER */}
      <header className="prontuario-header">
        <div>
          <h1>Prontuário do Paciente</h1>
          {paciente && (
            <p className="paciente-info">
              {paciente.nome} • {paciente.idade} anos • {paciente.sexo} • CPF:{" "}
              {paciente.cpf}
            </p>
          )}
        </div>

        <div className="prontuario-header-actions">
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => navigate(-1)}
          >
            Voltar
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            disabled={salvando}
            onClick={() => handleSalvar("rascunho")}
          >
            {salvando ? "Salvando..." : "Salvar rascunho"}
          </button>
          <button
            type="button"
            className="btn btn-primary"
            disabled={salvando}
            onClick={() => handleSalvar("finalizado")}
          >
            Finalizar consulta
          </button>
        </div>
      </header>

      {/* CONTEÚDO */}
      <main className="prontuario-content">
        {/* COLUNA ESQUERDA: FORMULÁRIO */}
        <section className="prontuario-form">
          <Card titulo="Queixa principal">
            <textarea
              name="queixaPrincipal"
              value={form.queixaPrincipal}
              onChange={handleChange}
              placeholder="Motivo da consulta, início dos sintomas, etc."
            />
          </Card>

          <Card titulo="História da doença atual">
            <textarea
              name="historiaDoencaAtual"
              value={form.historiaDoencaAtual}
              onChange={handleChange}
            />
          </Card>

          <div className="prontuario-grid-2">
            <Card titulo="Antecedentes / Comorbidades">
              <textarea
                name="antecedentes"
                value={form.antecedentes}
                onChange={handleChange}
              />
            </Card>

            <Card titulo="Medicações em uso / Alergias">
              <textarea
                name="medicacoesUso"
                value={form.medicacoesUso}
                onChange={handleChange}
                placeholder="Medicações em uso atual"
              />
              <textarea
                name="alergias"
                value={form.alergias}
                onChange={handleChange}
                placeholder="Alergias conhecidas"
              />
            </Card>
          </div>

          <Card titulo="Exame físico">
            <textarea
              name="exameFisico"
              value={form.exameFisico}
              onChange={handleChange}
            />
          </Card>

          <div className="prontuario-grid-2">
            <Card titulo="Hipóteses diagnósticas">
              <textarea
                name="hipotesesDiagnosticas"
                value={form.hipotesesDiagnosticas}
                onChange={handleChange}
              />
            </Card>

            <Card titulo="Conduta / Prescrição">
              <textarea
                name="conduta"
                value={form.conduta}
                onChange={handleChange}
              />
            </Card>
          </div>
        </section>

        {/* COLUNA DIREITA: HISTÓRICO */}
        <aside className="prontuario-sidebar">
          <Card titulo="Consultas anteriores">
            {consultasAnteriores.length === 0 && (
              <p className="texto-muted">Nenhuma consulta anterior registrada.</p>
            )}

            <ul className="lista-consultas">
              {consultasAnteriores.map((c) => (
                <li key={c.id} className="item-consulta">
                  <div>
                    <strong>{new Date(c.dataHora).toLocaleString()}</strong>
                    <p>{c.resumo || "Sem resumo"}</p>
                  </div>
                  <button
                    type="button"
                    className="link-ver-mais"
                    onClick={() => navigate(`/medico/consulta/${c.id}`)}
                  >
                    Ver detalhes
                  </button>
                </li>
              ))}
            </ul>
          </Card>

          <Card titulo="Ações rápidas">
            <button
              type="button"
              className="btn btn-full"
              onClick={() => navigate(`/medico/paciente/${pacienteId}/exames`)}
            >
              Ver exames do paciente
            </button>
            <button
              type="button"
              className="btn btn-full btn-outline"
              onClick={() => window.print()}
            >
              Imprimir prontuário
            </button>
          </Card>
        </aside>
      </main>
    </div>
  );
}

function Card({ titulo, children }) {
  return (
    <div className="card">
      {titulo && <h2 className="card-title">{titulo}</h2>}
      <div className="card-body">{children}</div>
    </div>
  );
}
