# CliniData

**CliniData** é um sistema para clínicas e hospitais que conecta **médicos, instituições de saúde e pacientes** em uma plataforma simples e integrada.

O sistema permite que clínicas façam o registro de consultas, que médicos acompanhem o histórico dos pacientes, e que os próprios pacientes organizem seus exames através de um aplicativo móvel.

## ✨ O que o sistema faz

### Para Clínicas e Médicos
- Cadastrar e gerenciar pacientes
- Agendar e registrar consultas médicas  
- Visualizar histórico completo dos pacientes
- Gerar relatórios de atendimentos
- Controlar gastos com materiais e medicamentos

### Para Pacientes  
- Aplicativo no celular para fotografar e organizar exames
- Ver todas as consultas e exames em um só lugar
- Compartilhar informações médicas com diferentes médicos
- Receber lembretes de consultas e medicamentos

## 🏗 Como o projeto está organizado

O CliniData é dividido em 4 partes principais que trabalham juntas:

### **CliniData.API** (Servidor/Backend)
Feito em **.NET** - É o "cérebro" do sistema que:
- Guarda todos os dados no banco de dados
- Controla quem pode acessar o que
- Processa as informações entre as outras partes

### **CliniData.Web** (Site para Médicos)  
Feito em **React** - Site que médicos e clínicas usam para:
- Cadastrar e buscar pacientes
- Marcar consultas
- Ver relatórios e estatísticas

### **CliniData.Mobile** (App do Paciente)
Feito em **React Native** - Aplicativo que pacientes usam para:
- Fotografar exames e resultados
- Ver seu histórico médico
- Agendar consultas

### **CliniData.Domain** (Regras do Negócio)
Contém as **regras principais** do sistema, como:
- Como validar dados de pacientes  
- Quando uma consulta pode ser marcada
- Que informações são obrigatórias

## 📂 Estrutura das Pastas

```
CliniData/
├── API/              # Servidor em .NET
├── Web/              # Site em React  
├── Mobile/           # App em React Native
├── Domain/           # Regras de negócio
├── Database/         # Scripts do banco de dados
└── README.md         # Este arquivo
```

<img width="615" height="250" alt="image" src="https://github.com/user-attachments/assets/54b44912-de09-4862-b784-460bf593e1b8" />

## 🛠 Tecnologias

- **.NET 8** – Para criar o servidor/API
- **React** – Para criar o site dos médicos  
- **React Native** – Para criar o app dos pacientes
- **SQL Server** – Para guardar os dados

## 📚 Como Usar Esta Documentação

### 🚀 Para Começar a Desenvolver
- **[Configuração do Ambiente](./DEVELOPMENT.md)** - Como instalar e configurar tudo
- **[Como Contribuir](./CONTRIBUTING.md)** - Regras para trabalhar no projeto

### 📖 Documentação de Cada Parte
- **[CliniData.API](./API/README.md)** - Servidor que conecta tudo
  - Como rodar o servidor  
  - Como funciona a autenticação
  - Lista de todas as funcionalidades da API
  
- **[CliniData.Web](./Web/README.md)** - Site para médicos e clínicas
  - Como criar e editar as telas
  - Como adicionar novos componentes
  - Como fazer formulários e validações
  
- **[CliniData.Mobile](./Mobile/README.md)** - App para os pacientes
  - Como funciona a câmera para exames  
  - Como o app funciona sem internet
  - Como enviar notificações
  
- **[CliniData.Domain](./Domain/README.md)** - Regras de negócio
  - Como funcionam as validações
  - Quais são as regras do sistema
  - Como adicionar novas funcionalidades

### 📋 Informações Extras
- **[Mudanças do Projeto](./CHANGELOG.md)** - O que mudou em cada versão
- **[Licença](./LICENSE)** - Termos de uso do código
