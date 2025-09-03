# CliniData

**CliniData** é uma plataforma de gestão integrada de saúde que conecta **instituições médicas, profissionais de saúde e pacientes**.  
O sistema permite o registro de consultas, acompanhamento do histórico do paciente e controle de insumos, além de oferecer um aplicativo para que os pacientes possam centralizar seus exames e informações clínicas.

## ✨ Funcionalidades

- **Instituições e médicos**
  - Cadastro de instituições e médicos vinculados.
  - Registro de consultas com dados completos dos pacientes.
  - Relatórios de atendimentos e procedimentos realizados.
  - Controle de gastos com materiais.

- **Pacientes**
  - Aplicativo móvel para cadastro de exames por meio de foto.
  - Histórico completo de consultas e exames acessível pelo perfil.
  - Compartilhamento de informações com médicos e instituições.

## 🏗 Arquitetura do Projeto

O **CliniData** é construído em uma arquitetura moderna e desacoplada, garantindo escalabilidade e manutenibilidade:

- **CliniData.API**  
  Desenvolvido em **.NET**, responsável pela comunicação com o frontend e persistência dos dados.

- **CliniData.Web**  
  Construído em **React**, voltado para instituições e médicos gerenciarem consultas, pacientes e relatórios.

- **CliniData.Mobile**  
  Criado em **React Native**, focado na experiência do paciente para registro de exames e acompanhamento de histórico.

- **CliniData.Domain**  
  Camada de regras de negócio e lógica de domínio, separada para garantir organização e clareza no desenvolvimento.

## 📂 Estrutura do Repositório

O projeto segue uma estrutura organizada, com todas as camadas em um único repositório:

<img width="615" height="250" alt="image" src="https://github.com/user-attachments/assets/54b44912-de09-4862-b784-460bf593e1b8" />

## 🛠 Tecnologias Utilizadas

- **.NET** – Backend API
- **React** – Frontend Web
- **React Native** – Aplicativo Mobile
- **Domain Layer** – Regras de negócio desacopladas
