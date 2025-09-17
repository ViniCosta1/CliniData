# Modelagem do Banco de Dados - CliniData

Este diretório contém os arquivos relacionados à modelagem do banco de dados do projeto **CliniData**.

<img width="1448" height="1136" alt="CliniDataDB" src="https://github.com/user-attachments/assets/dc829e23-e89f-43ce-aa5b-aa269331a8ae" />


## SGBD Utilizado

O banco foi modelado para uso com **SQL Server**.  
**Por que escolher o SQL Server?**
- Plataforma robusta, segura e amplamente utilizada no mercado nacional.
- Excelente suporte para integrações, escalabilidade e gerenciamento de dados clínicos.
- Ferramentas de administração intuitivas e facilidade para implementar procedimentos armazenados, triggers e views.
- Compatibilidade com diversos frameworks e linguagens de programação.

## Estrutura das Tabelas

A modelagem foi pensada para ser simples, clara e atender os principais requisitos de uma clínica digital.

### **1. Paciente**
Armazena os dados dos pacientes atendidos pela clínica.
- **Principais campos:** Nome, data de nascimento, sexo, CPF, telefone, e-mail.
- **Endereço:** Detalhado em rua, número, complemento, bairro, cidade, estado e CEP para facilitar pesquisas e relatórios.

### **2. Médico**
Registra os profissionais que realizam atendimentos.
- **Principais campos:** Nome, CRM (registro profissional, único), especialidade, telefone, e-mail.
- **Instituição vinculada:** Indica onde o médico atende.
- **Observação:** O CRM deve ser preenchido no formato XXXXX/XX (ex: 12345/SP) e é único por estado.

### **3. Instituição**
Representa clínicas, hospitais ou laboratórios.
- **Principais campos:** Nome, CNPJ (único), telefone.
- **Endereço:** Detalhado em rua, número, bairro, cidade, estado e CEP.
- **Observação:** O CNPJ garante que não existam instituições duplicadas.

### **4. Especialidade Médica**
Tabela auxiliar para categorizar os médicos por área de atuação.
- **Campo principal:** Nome da especialidade.
- **Observação:** Facilita buscas, relatórios e organização dos profissionais.

### **5. Consulta**
Registra os atendimentos realizados entre médicos e pacientes.
- **Principais campos:** Data e hora, paciente, médico, instituição, observação.
- **Observação:** Permite acompanhar o histórico de consultas de cada paciente.

### **6. Exame**
Armazena os exames solicitados/realizados para os pacientes.
- **Principais campos:** Tipo de exame, data/hora, paciente, médico, instituição, resultado, observação.
- **Observação:** Permite controlar e consultar exames por paciente e médico.

### **7. Histórico Médico**
Guarda registros relevantes do histórico clínico do paciente.
- **Principais campos:** Paciente, data do registro, descrição, médico responsável.
- **Observação:** Permite acompanhar o histórico de saúde e tratamentos do paciente.

---

## Observações Gerais

- Os campos de documentos (CPF, CNPJ, CRM) possuem restrições de unicidade para garantir a integridade dos dados.
- O endereço foi detalhado em múltiplos campos para facilitar buscas, filtros e relatórios por região.
- O CRM do médico deve ser preenchido no formato XXXXX/XX, sendo único por estado.
- A tabela EspecialidadeMedica é opcional, mas recomendada para organização e consultas por área médica.
- O modelo pode ser expandido conforme novas necessidades do projeto.
- Caso precise adaptar para outro SGBD, pode ser necessário ajustar tipos de dados ou sintaxe.

---

Se tiver dúvidas sobre a estrutura ou precisar de adaptações, consulte este README ou os arquivos de modelagem!
