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

## 📚 Documentação Detalhada

### 📖 Documentação por Módulo
- **[CliniData.API](./API/README.md)** - Documentação completa da API .NET
  - Arquitetura e padrões de design
  - Endpoints e modelos de dados
  - Autenticação e autorização
  - Configuração e deployment
  
- **[CliniData.Domain](./Domain/README.md)** - Camada de domínio e regras de negócio
  - Domain-Driven Design (DDD)
  - Entidades e value objects
  - Serviços de domínio e especificações
  - Eventos de domínio
  
- **[CliniData.Web](./Web/README.md)** - Aplicação frontend React
  - Arquitetura de componentes
  - Gerenciamento de estado
  - Formulários e validações
  - Design system e responsividade
  
- **[CliniData.Mobile](./Mobile/README.md)** - Aplicativo móvel React Native
  - Navegação e estrutura mobile
  - Captura de exames por foto
  - Armazenamento offline
  - Notificações push

### 🚀 Guias de Desenvolvimento
- **[Guia de Configuração](./DEVELOPMENT.md)** - Setup completo do ambiente de desenvolvimento
  - Pré-requisitos e instalação
  - Configuração de IDEs
  - Docker e ferramentas de desenvolvimento
  - Troubleshooting comum

- **[Guia de Contribuição](./CONTRIBUTING.md)** - Como contribuir com o projeto
  - Fluxo de trabalho Git
  - Padrões de código e commits
  - Code review e testes
  - Processo de release

### 📋 Informações do Projeto
- **[Changelog](./CHANGELOG.md)** - Histórico de mudanças e versões
- **[Licença](./LICENSE)** - Termos de uso e distribuição
