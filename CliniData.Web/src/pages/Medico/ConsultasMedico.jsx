export default function ConsultasMedico({ consultas, onAtender }) {
  const temConsultas = consultas && consultas.length > 0;

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
                      onClick={() => onAtender(c.pacienteId, c.id)}
                    >
                      Atender
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
