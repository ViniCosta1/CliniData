import React, { useState } from "react";
import "./Cadastro.css";
import { cadastrarInstituicao, cadastrarMedico } from "../../services/cadastroService";

export default function Cadastro() {
    const [tipo, setTipo] = useState("instituicao");

    const especialidades = [
        "Cardiologia",
        "Pediatria",
        "Dermatologia",
        "Ortopedia",
        "Ginecologia",
        "Clínico Geral"
    ];

    const handleInstituicao = async (e) => {
        e.preventDefault();
        const form = new FormData(e.target);
        const data = Object.fromEntries(form);

        const payload = {
            nome: data.nome,
            cnpj: data.cnpj,
            contato: data.telefone,
            senha: data.senha,
            endereco: {
                rua: data.rua,
                numero: data.numero,
                bairro: data.bairro,
                cidade: data.cidade,
                estado: data.estado,
                cep: data.cep
            }
        };

        try {
            await cadastrarInstituicao(payload);
            alert("Instituição cadastrada com sucesso!");
        } catch (error) {
            console.log(error);
            alert("Erro ao cadastrar instituição");
        }
    };

    const handleMedico = async (e) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(e.target));

        try {
            await cadastrarMedico(data);
            alert("Médico cadastrado com sucesso!");
        } catch (error) {
            console.log(error);
            alert("Erro ao cadastrar médico");
        }
    };

    return (
        <div className="cadastro-wrapper">
            <div className="cadastro-box">
                <h1 className="cadastro-title">Cadastro</h1>

                <div className="switch-container">
                    <button 
                        className={tipo === "instituicao" ? "active" : ""}
                        onClick={() => setTipo("instituicao")}
                    >
                        Instituição
                    </button>

                    <button 
                        className={tipo === "medico" ? "active" : ""}
                        onClick={() => setTipo("medico")}
                    >
                        Médico
                    </button>
                </div>

                {tipo === "instituicao" ? (
                    <form className="cadastro-form" onSubmit={handleInstituicao}>
                        <h2 className="section-title">Cadastrar Instituição</h2>

                        <input name="nome" placeholder="Nome" required />
                        <input name="cnpj" placeholder="CNPJ" required />
                        <input name="telefone" placeholder="Telefone" required />
                        <input name="senha" placeholder="Senha de acesso" type="password" required />

                        <h3 className="section-subtitle">Endereço</h3>

                        <input name="rua" placeholder="Rua" />
                        <input name="numero" placeholder="Número" />
                        <input name="bairro" placeholder="Bairro" />
                        <input name="cidade" placeholder="Cidade" />
                        <input name="estado" placeholder="Estado" />
                        <input name="cep" placeholder="CEP" />

                        <button className="btn-submit">Cadastrar</button>
                    </form>
                ) : (
                    <form className="cadastro-form" onSubmit={handleMedico}>
                        <h2 className="section-title">Cadastrar Médico</h2>

                        <input name="nome" placeholder="Nome" required />
                        <input name="crm" placeholder="CRM" required />
                        <input name="email" placeholder="Email" required />
                        <input name="telefone" placeholder="Telefone" required />

                        <select name="especialidadeId" required>
                            <option value="">Selecione uma especialidade</option>
                            {especialidades.map((e, i) => (
                                <option key={i} value={i + 1}>{e}</option>
                            ))}
                        </select>

                        <button className="btn-submit">Cadastrar</button>
                    </form>
                )}
            </div>
        </div>
    );
}
