import React, { useState } from 'react';
import Header from '../../components/Header';

export default function Prontuario() {
    const [cpf, setCpf] = useState('');
    const [descricao, setDescricao] = useState('');

    async function buscarPaciente() {
        // TODO: usar API para buscar paciente por CPF e carregar dados
        alert('Buscar paciente: ' + cpf);
    }

    function salvar() {
        // TODO: salvar prontuário via API
        alert('Prontuário salvo');
    }

    return (
        <div>
            <Header />

            <div className="container" style={{ paddingTop: 24 }}>
                <h2>Prontuário</h2>

                <div>
                    <label>CPF do Paciente</label>
                    <input
                        value={cpf}
                        onChange={(e) => setCpf(e.target.value)}
                        placeholder="000.000.000-00"
                    />
                    <button onClick={buscarPaciente}>Buscar</button>
                </div>

                <div style={{ marginTop: 20 }}>
                    <label>Descrição / Observações</label>
                    <textarea
                        value={descricao}
                        onChange={(e) => setDescricao(e.target.value)}
                        rows={6}
                        style={{ width: '100%' }}
                    />
                </div>

                <button
                    style={{ marginTop: 20 }}
                    className="btn-primary"
                    onClick={salvar}
                >
                    Salvar Prontuário
                </button>
            </div>
        </div>
    );
}