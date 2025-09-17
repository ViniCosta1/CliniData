# Como Contribuir - CliniData

## 🤝 Bem-vindo!

Obrigado por querer contribuir com o CliniData! Este documento vai te ajudar a entender como trabalhar no projeto e seguir as regras que mantêm tudo organizado.

## 📋 Antes de começar

### O que você precisa saber
- **Node.js 18+** para desenvolvimento Web e Mobile
- **.NET 8.0** para desenvolvimento da API
- **Git** para controle de versão
- **Visual Studio Code** ou **Visual Studio 2022** (recomendado)

### Ferramentas específicas
- **SQL Server LocalDB** para desenvolvimento local
- **Entity Framework Core Tools**: `dotnet tool install --global dotnet-ef`
- **Expo CLI**: `npm install -g @expo/cli`
- **Android Studio** para desenvolvimento Android (opcional)
- **Xcode** para desenvolvimento iOS - só no Mac (opcional)

## 🔄 Como trabalhar no projeto

### 1. Preparar o ambiente
```bash
# 1. Faça um fork do repositório no GitHub
# 2. Clone seu fork
git clone https://github.com/seu-usuario/CliniData.git
cd CliniData

# 3. Adicione o repositório original como upstream
git remote add upstream https://github.com/ViniCosta1/CliniData.git

# 4. Configure sua identidade Git
git config user.name "Seu Nome"
git config user.email "seu.email@exemplo.com"
```

### 2. Criar uma branch para sua funcionalidade
```bash
# Sempre crie uma branch específica para o que você vai fazer
git checkout -b feature/nome-da-funcionalidade
# ou
git checkout -b bugfix/nome-do-bug
# ou
git checkout -b docs/melhoria-documentacao
```

**Nomes de branch recomendados**:
- `feature/adicionar-login-paciente`
- `bugfix/corrigir-upload-foto`
- `docs/atualizar-readme-api`
- `refactor/simplificar-validacao-cpf`

### 3. Fazer suas mudanças
```bash
# Mantenha sua branch atualizada
git fetch upstream
git rebase upstream/main

# Faça mudanças pequenas e teste cada uma
# Teste localmente antes de fazer commit

# Faça commits pequenos e claros
git add .
git commit -m "Adiciona validação de CPF no cadastro"
```

### 4. Enviar suas mudanças
```bash
# Envie para seu fork
git push origin feature/nome-da-funcionalidade

# Abra um Pull Request no GitHub
# Descreva o que você fez e por que fez
```

## 📝 Como escrever commits

Use mensagens claras que expliquem o que você fez:

### Formato simples
```
tipo: descrição clara do que foi feito

Exemplos:
feat: adiciona busca de pacientes por nome
fix: corrige erro ao salvar consulta
docs: atualiza instruções de instalação
```

### Tipos de commit
- **feat**: Nova funcionalidade
- **fix**: Correção de erro
- **docs**: Mudança na documentação
- **refactor**: Melhoria no código sem mudar funcionamento
- **test**: Adição de testes

### Exemplos bons ✅
```bash
feat: adiciona tela de cadastro de paciente
fix: corrige upload de foto no mobile
docs: simplifica README da API
refactor: organiza componentes do formulário
test: adiciona teste para validação de CPF
```

### Exemplos ruins ❌
```bash
git commit -m "fix"
git commit -m "alterações"
git commit -m "código novo"
```

## 🏗 Regras do código

### Como organizar arquivos
- **API (.NET)**: Use PascalCase (`PatientController.cs`)
- **Web (React)**: Use PascalCase para componentes (`PatientForm.tsx`)
- **Mobile (React Native)**: Use PascalCase + "Screen" (`PatientListScreen.tsx`)

### Regras importantes
1. **API (.NET)**:
   - Classes em PascalCase: `PatientService`
   - Métodos em PascalCase: `GetPatientById()`
   - Propriedades em PascalCase: `FirstName`

2. **Web/Mobile (React)**:
   - Componentes em PascalCase: `PatientForm`
   - Funções em camelCase: `handleSubmit`
   - Constantes em UPPER_CASE: `API_URL`

3. **Geral**:
   - Nomes em inglês no código
   - Comentários em português
   - Sempre teste antes de enviar

## 🧪 Testes

### Quando escrever testes
- **Novas funcionalidades**: Sempre teste a lógica principal
- **Correção de bugs**: Escreva um teste que reproduz o problema
- **Componentes complexos**: Teste as interações importantes

### Como rodar testes
```bash
# API
cd API && dotnet test

# Web
cd Web && npm test

# Mobile
cd Mobile && npm test
```

## 📋 Checklist antes de enviar

Antes de abrir um Pull Request, verifique:

- [ ] ✅ Código compila sem erros
- [ ] ✅ Testes passam
- [ ] ✅ Funcionalidade funciona como esperado
- [ ] ✅ Seguiu as regras de nomenclatura
- [ ] ✅ Commit tem mensagem clara
- [ ] ✅ Documentação foi atualizada (se necessário)

## 🐛 Como reportar bugs

Se encontrar um problema:

1. **Verifique se já existe**: Procure nas issues existentes
2. **Descreva o problema**: O que estava fazendo quando deu erro?
3. **Como reproduzir**: Passo a passo para reproduzir o erro
4. **O que esperava**: O que deveria ter acontecido?
5. **Screenshots**: Se for problema visual, adicione prints

### Exemplo de bug report
```
## Bug: Erro ao salvar paciente

**Descrição**: Quando clico em "Salvar" no formulário de paciente, aparece erro.

**Como reproduzir**:
1. Vá para "Pacientes" > "Novo Paciente"
2. Preencha todos os campos
3. Clique em "Salvar"
4. Aparece erro: "CPF inválido"

**Esperado**: Paciente deveria ser salvo sem erro

**Ambiente**: Chrome, Windows 10
```

## 🚀 Como sugerir melhorias

Para sugerir novas funcionalidades:

1. **Descreva a ideia**: O que você gostaria que fosse adicionado?
2. **Por que é útil**: Que problema isso resolve?
3. **Como funcionaria**: Descreva como o usuário usaria
4. **Alternativas**: Já tentou resolver de outra forma?

## 📞 Precisa de ajuda?

- **Dúvidas técnicas**: Abra uma Discussion no GitHub
- **Bugs**: Abra uma Issue
- **Novas ideias**: Abra uma Issue com o tipo "enhancement"

## 🎯 Dicas importantes

1. **Comece pequeno**: Faça pequenas mudanças primeiro para conhecer o projeto
2. **Pergunte antes**: Se não tem certeza de algo, pergunte antes de começar
3. **Seja paciente**: Code review pode demorar alguns dias
4. **Mantenha simples**: Código simples é melhor que código complexo
5. **Documente**: Se fez algo complexo, explique em comentários

Obrigado por contribuir com o CliniData! 🏥💙