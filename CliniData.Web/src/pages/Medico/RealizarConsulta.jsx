import "./RealizarConsulta.css";
import { useParams, useNavigate } from "react-router-dom";

export default function RealizarConsulta() {
  const { consultaId } = useParams();
  const navigate = useNavigate();

  const titulo = `Consulta #${consultaId}`;

  return (
    <div className="prontuario-page">
      {/* HEADER */}
      <header className="prontuario-header">
        <div>
          <h1>{titulo}</h1>
          <p className="paciente-info">
            Aqui o médico realiza o atendimento, registra a anamnese, exame físico,
            hipóteses diagnósticas, conduta e os materiais utilizados.
          </p>
        </div>

        <div className="prontuario-header-actions">
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => navigate("/medico/dashboard")}
          >
            Voltar
          </button>
          <button
            type="button"
            className="btn btn-secondary"
          >
            Salvar rascunho
          </button>
          <button
            type="button"
            className="btn btn-primary"
          >
            Finalizar consulta
          </button>
        </div>
      </header>

      {/* CONTEÚDO DA CONSULTA */}
      <main className="prontuario-content">
        <section className="prontuario-form">
          {/* QUEIXA PRINCIPAL */}
          <div className="card">
            <h2 className="card-title">Queixa principal</h2>
            <div className="card-body">
              <textarea
                placeholder="Ex: Dor torácica há 2 horas, piora aos esforços..."
              />
            </div>
          </div>

          {/* HISTÓRIA DA DOENÇA ATUAL */}
          <div className="card">
            <h2 className="card-title">História da doença atual</h2>
            <div className="card-body">
              <textarea
                placeholder="Descreva início, evolução, sintomas associados, fatores de melhora/piora..."
              />
            </div>
          </div>

          {/* ANTECEDENTES / MEDICAÇÕES / ALERGIAS */}
          <div className="prontuario-grid-2">
            <div className="card">
              <h2 className="card-title">Antecedentes / Comorbidades</h2>
              <div className="card-body">
                <textarea
                  placeholder="Ex: HAS, DM2, IAM prévio, cirurgias anteriores, histórico familiar..."
                />
              </div>
            </div>

            <div className="card">
              <h2 className="card-title">Medicações em uso / Alergias</h2>
              <div className="card-body">
                <textarea
                  placeholder="Medicações de uso contínuo, doses e horários..."
                />
                <textarea
                  placeholder="Alergias medicamentosas, alimentares, contato, etc."
                />
              </div>
            </div>
          </div>

          {/* EXAME FÍSICO (SIMPLIFICADO) */}
          <div className="card">
            <h2 className="card-title">Exame físico</h2>
            <div className="card-body">
              <div className="sinais-vitais-grid sinais-vitais-simples">
                <label>
                  <span>PA (mmHg)</span>
                  <input type="text" placeholder="120/80" />
                </label>

                <label>
                  <span>FC (bpm)</span>
                  <input type="text" placeholder="80" />
                </label>

                <label>
                  <span>Temperatura (°C)</span>
                  <input type="text" placeholder="36,5" />
                </label>
              </div>

              <textarea
                placeholder="Descreva achados relevantes do exame físico (geral, cardiorrespiratório, abdominal, neurológico, etc.)..."
              />
            </div>
          </div>

          {/* HIPÓTESES DIAGNÓSTICAS + CONDUTA */}
          <div className="prontuario-grid-2">
            <div className="card">
              <h2 className="card-title">Hipóteses diagnósticas</h2>
              <div className="card-body">
                <textarea
                  placeholder="Liste as principais hipóteses (pode incluir CID-10 futuramente)..."
                />
              </div>
            </div>

            <div className="card">
              <h2 className="card-title">Conduta / Prescrição</h2>
              <div className="card-body">
                <textarea
                  placeholder="Condutas, exames solicitados, medicações prescritas, orientações de retorno..."
                />
              </div>
            </div>
          </div>

          {/* OBSERVAÇÕES FINAIS / ORIENTAÇÕES AO PACIENTE */}
          <div className="card">
            <h2 className="card-title">Observações e orientações ao paciente</h2>
            <div className="card-body">
              <textarea
                placeholder="Recomendações, sinais de alarme, intervalos de retorno, instruções específicas..."
              />
            </div>
          </div>

          {/* CONTROLE DE EQUIPAMENTOS / MATERIAIS UTILIZADOS */}
          <div className="card">
            <h2 className="card-title">Materiais e equipamentos utilizados na consulta</h2>
            <div className="card-body">
              <p className="texto-muted">
                Registre tudo que foi utilizado para esta consulta. Isso será usado para
                controle de estoque e custo (seringas, agulhas, luvas, cateteres, equipo,
                medicamentos usados em sala, etc.).
              </p>

              <table className="tabela-simples tabela-equipamentos">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Descrição / Material</th>
                    <th>Quantidade</th>
                    <th>Unidade</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>
                      <input
                        type="text"
                        placeholder="Ex: Seringa 3 mL, agulha 25x7, luva procedimento..."
                      />
                    </td>
                    <td>
                      <input type="number" min="0" placeholder="0" />
                    </td>
                    <td>
                      <input type="text" placeholder="unidade, par, mL..." />
                    </td>
                  </tr>
                  <tr>
                    <td>2</td>
                    <td>
                      <input
                        type="text"
                        placeholder="Ex: Cateter periférico 20G, equipo macrogotas..."
                      />
                    </td>
                    <td>
                      <input type="number" min="0" placeholder="0" />
                    </td>
                    <td>
                      <input type="text" placeholder="unidade, par, mL..." />
                    </td>
                  </tr>
                  <tr>
                    <td>3</td>
                    <td>
                      <input
                        type="text"
                        placeholder="Ex: Soro fisiológico 0,9%, ampola de medicamento..."
                      />
                    </td>
                    <td>
                      <input type="number" min="0" placeholder="0" />
                    </td>
                    <td>
                      <input type="text" placeholder="unidade, mL, frasco..." />
                    </td>
                  </tr>
                  <tr>
                    <td>4</td>
                    <td>
                      <input
                        type="text"
                        placeholder="Outro material utilizado..."
                      />
                    </td>
                    <td>
                      <input type="number" min="0" placeholder="0" />
                    </td>
                    <td>
                      <input type="text" placeholder="unidade..." />
                    </td>
                  </tr>
                  <tr>
                    <td>5</td>
                    <td>
                      <input
                        type="text"
                        placeholder="Outro material utilizado..."
                      />
                    </td>
                    <td>
                      <input type="number" min="0" placeholder="0" />
                    </td>
                    <td>
                      <input type="text" placeholder="unidade..." />
                    </td>
                  </tr>
                </tbody>
              </table>

              <p className="texto-muted small-hint">
                * No futuro, isso pode virar uma lista dinâmica vinda do estoque da
                instituição (combobox com materiais cadastrados).
              </p>
            </div>
          </div>
        </section>

        {/* Sidebar opcional */}
        <aside className="prontuario-sidebar">
          <div className="card">
            <h2 className="card-title">Resumo da consulta</h2>
            <div className="card-body">
              <p className="texto-muted">
                Aqui você pode, futuramente, exibir:
              </p>
              <ul className="lista-simples">
                <li>• Dados básicos do paciente</li>
                <li>• Alergias em destaque</li>
                <li>• Medicações de uso contínuo</li>
                <li>• Exames recentes relevantes</li>
                <li>• Histórico de consultas anteriores</li>
              </ul>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}
