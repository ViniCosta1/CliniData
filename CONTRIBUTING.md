# Guia de Contribuição - CliniData

## 🤝 Como Contribuir

Agradecemos seu interesse em contribuir com o CliniData! Este documento fornece diretrizes para garantir que o processo de contribuição seja eficiente e mantenha a qualidade do código.

## 📋 Pré-requisitos

### Ambiente de Desenvolvimento
- **Node.js 18+** para desenvolvimento Web e Mobile
- **.NET 8.0 SDK** para desenvolvimento da API
- **Git** para controle de versão
- **Visual Studio Code** ou **Visual Studio 2022** (recomendado)

### Ferramentas Específicas por Plataforma

#### API (.NET)
- **SQL Server LocalDB** para desenvolvimento local
- **Entity Framework Core Tools**: `dotnet tool install --global dotnet-ef`

#### Web (React)
- **npm** ou **yarn** como gerenciador de pacotes

#### Mobile (React Native)
- **Expo CLI**: `npm install -g @expo/cli`
- **Android Studio** para desenvolvimento Android
- **Xcode** para desenvolvimento iOS (apenas macOS)

## 🔄 Fluxo de Trabalho

### 1. Configuração Inicial
```bash
# 1. Fork o repositório no GitHub
# 2. Clone seu fork
git clone https://github.com/seu-usuario/CliniData.git
cd CliniData

# 3. Adicione o repositório original como upstream
git remote add upstream https://github.com/ViniCosta1/CliniData.git

# 4. Configure sua identidade Git
git config user.name "Seu Nome"
git config user.email "seu.email@exemplo.com"
```

### 2. Criando uma Branch
```bash
# Sempre trabalhe em uma branch específica para sua feature/bugfix
git checkout -b tipo/nome-da-feature

# Exemplos:
git checkout -b feature/patient-search
git checkout -b bugfix/appointment-validation
git checkout -b docs/api-documentation
```

### 3. Tipos de Branch
- **feature/**: Novas funcionalidades
- **bugfix/**: Correção de bugs
- **hotfix/**: Correções urgentes para produção
- **docs/**: Melhorias na documentação
- **refactor/**: Refatoração de código
- **test/**: Adição ou melhoria de testes

### 4. Desenvolvimento
```bash
# Mantenha sua branch atualizada
git fetch upstream
git rebase upstream/main

# Faça commits pequenos e descritivos
git add .
git commit -m "feat: adiciona validação de CPF no cadastro de paciente"

# Use conventional commits (veja seção específica)
```

### 5. Pull Request
```bash
# Push para sua branch
git push origin feature/nome-da-feature

# Abra um Pull Request no GitHub
# Use o template de PR fornecido
```

## 📝 Conventional Commits

Utilizamos a convenção [Conventional Commits](https://www.conventionalcommits.org/) para padronizar mensagens de commit:

### Formato
```
<tipo>[escopo opcional]: <descrição>

[corpo opcional]

[rodapé opcional]
```

### Tipos Principais
- **feat**: Nova funcionalidade
- **fix**: Correção de bug
- **docs**: Mudanças na documentação
- **style**: Formatação, espaçamento (não afeta código)
- **refactor**: Refatoração sem mudar funcionalidade
- **test**: Adição ou correção de testes
- **chore**: Tarefas de build, configuração

### Exemplos
```bash
feat(api): adiciona endpoint para busca de pacientes
fix(mobile): corrige crash ao capturar foto de exame
docs(web): atualiza documentação dos componentes
style(api): aplica formatação no controller de consultas
refactor(domain): simplifica validação de agendamento
test(web): adiciona testes para componente PatientForm
chore(mobile): atualiza dependências do Expo
```

### Escopos por Projeto
- **api**: Código do backend .NET
- **web**: Aplicação React
- **mobile**: Aplicação React Native
- **domain**: Camada de domínio
- **docs**: Documentação
- **ci**: Integração contínua

## 🏗 Padrões de Código

### Estrutura de Arquivos
```
# Novos arquivos devem seguir a estrutura existente
API/
├── Controllers/
│   └── PatientsController.cs      # PascalCase para C#
Web/
├── src/components/
│   └── PatientForm.tsx            # PascalCase para componentes
Mobile/
├── src/screens/
│   └── PatientListScreen.tsx      # PascalCase + "Screen"
```

### Convenções de Nomenclatura

#### C# (API/Domain)
```csharp
// Classes e métodos: PascalCase
public class PatientService
{
    public async Task<Patient> GetPatientAsync(int id) { }
}

// Variáveis locais e parâmetros: camelCase
var patientName = "João Silva";
public void UpdatePatient(Patient patient, string updatedBy) { }

// Constantes: PascalCase
public const string DefaultTimeZone = "America/Sao_Paulo";

// Interfaces: Prefixo "I"
public interface IPatientRepository { }
```

#### TypeScript (Web/Mobile)
```typescript
// Componentes e tipos: PascalCase
interface PatientProps {
  patient: Patient;
  onEdit: (patient: Patient) => void;
}

const PatientCard: React.FC<PatientProps> = ({ patient, onEdit }) => {
  // Variáveis e funções: camelCase
  const [isEditing, setIsEditing] = useState(false);
  
  const handleEditClick = () => {
    setIsEditing(true);
  };
};

// Hooks customizados: prefixo "use"
const usePatientData = (id: string) => { };

// Constantes: SCREAMING_SNAKE_CASE
const API_BASE_URL = 'https://api.clinidata.com';
```

### Formatação de Código

#### C# (.editorconfig)
```ini
[*.cs]
indent_style = space
indent_size = 4
end_of_line = crlf
insert_final_newline = true
trim_trailing_whitespace = true

# Naming conventions
dotnet_naming_rule.interfaces_should_be_prefixed_with_i.severity = warning
dotnet_naming_rule.interfaces_should_be_prefixed_with_i.symbols = interface_symbols
dotnet_naming_rule.interfaces_should_be_prefixed_with_i.style = prefix_interface_with_i
```

#### TypeScript (prettier.config.js)
```javascript
module.exports = {
  semi: true,
  trailingComma: 'es5',
  singleQuote: true,
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
};
```

## 🧪 Testes

### Cobertura Mínima
- **Novos recursos**: 80% de cobertura de código
- **Correções de bugs**: Teste que reproduz o bug + correção
- **APIs**: Testes de integração para endpoints críticos
- **Componentes**: Testes unitários para lógica complexa

### Estrutura de Testes

#### API (.NET)
```
CliniData.API.Tests/
├── Controllers/
│   └── PatientsControllerTests.cs
├── Services/
│   └── PatientServiceTests.cs
├── Integration/
│   └── PatientEndpointsTests.cs
└── Fixtures/
    └── PatientFixtures.cs
```

#### Web/Mobile (Jest)
```
tests/
├── components/
│   └── PatientForm.test.tsx
├── hooks/
│   └── usePatientData.test.ts
├── utils/
│   └── validation.test.ts
└── __mocks__/
    └── api.ts
```

### Comandos de Teste
```bash
# API
cd API
dotnet test --collect:"XPlat Code Coverage"

# Web
cd Web
npm test -- --coverage

# Mobile
cd Mobile
npm test -- --coverage
```

## 📋 Checklist de Pull Request

### Antes de Abrir o PR
- [ ] Código segue os padrões estabelecidos
- [ ] Testes foram adicionados/atualizados
- [ ] Documentação foi atualizada (se necessário)
- [ ] Build passa sem erros
- [ ] Testes passam com cobertura adequada
- [ ] Branch está atualizada com main

### Template de Pull Request
```markdown
## 📝 Descrição
Breve descrição das mudanças realizadas.

## 🔗 Issue Relacionada
Closes #123

## 📋 Tipo de Mudança
- [ ] Bug fix (mudança que corrige um problema)
- [ ] Nova feature (mudança que adiciona funcionalidade)
- [ ] Breaking change (mudança que quebra compatibilidade)
- [ ] Documentação

## 🧪 Como Testar
1. Execute o projeto localmente
2. Navegue para...
3. Verifique que...

## 📸 Screenshots (se aplicável)
<!-- Adicione screenshots para mudanças de UI -->

## ✅ Checklist
- [ ] Meu código segue os padrões do projeto
- [ ] Realizei code review do meu próprio código
- [ ] Comentei áreas complexas do código
- [ ] Atualizei a documentação
- [ ] Adicionei testes que provam que minha correção/feature funciona
- [ ] Testes novos e existentes passam localmente
```

## 🐛 Relatando Bugs

### Template de Issue para Bugs
```markdown
## 🐛 Descrição do Bug
Descrição clara e concisa do bug.

## 🔄 Passos para Reproduzir
1. Vá para '...'
2. Clique em '...'
3. Role para baixo até '...'
4. Veja o erro

## 🎯 Comportamento Esperado
Descrição do que deveria acontecer.

## 📸 Screenshots
Se aplicável, adicione screenshots.

## 💻 Ambiente
- OS: [ex: iOS, Android, Windows, macOS]
- Browser: [ex: Chrome, Safari]
- Versão: [ex: 22]
- Device: [ex: iPhone 12, Samsung Galaxy]

## 📋 Contexto Adicional
Qualquer informação adicional sobre o problema.
```

## 💡 Solicitando Features

### Template de Issue para Features
```markdown
## 🚀 Descrição da Feature
Descrição clara da funcionalidade desejada.

## 🎯 Problema que Resolve
Explicação do problema que esta feature resolve.

## 💭 Solução Proposta
Descrição da solução que você gostaria de ver.

## 🔄 Alternativas Consideradas
Outras soluções ou features que você considerou.

## 📋 Contexto Adicional
Informações adicionais, mockups, etc.
```

## 🔍 Code Review

### Para Reviewers
- **Foque na lógica**: Entenda o problema e se a solução é apropriada
- **Verifique testes**: Cobertura e qualidade dos testes
- **Considere performance**: Impacto na performance da aplicação
- **Avalie UX**: Para mudanças de interface, considere a experiência do usuário
- **Sugira melhorias**: Seja construtivo em seus comentários

### Para Autores
- **Responda rapidamente**: Trate feedback como uma conversa
- **Explique decisões**: Justifique escolhas não óbvias
- **Seja receptivo**: Aceite sugestões de melhoria
- **Faça pequenos PRs**: Facilita o review e acelera aprovação

### Critérios de Aprovação
- [ ] Funcionalidade implementada corretamente
- [ ] Código legível e bem estruturado
- [ ] Testes adequados e passando
- [ ] Documentação atualizada
- [ ] Sem regressões identificadas
- [ ] Performance aceitável

## 🚀 Deploy e Release

### Versionamento Semântico
Seguimos [Semantic Versioning](https://semver.org/):
- **MAJOR**: Mudanças incompatíveis de API
- **MINOR**: Funcionalidades adicionadas de forma compatível
- **PATCH**: Correções de bugs compatíveis

### Processo de Release
1. **Feature Freeze**: Congelar novas features
2. **Testing**: Testes extensivos em ambiente de staging
3. **Documentation**: Atualizar documentação e changelog
4. **Tag Release**: Criar tag com nova versão
5. **Deploy**: Deploy automático via CI/CD
6. **Monitoring**: Monitorar aplicação pós-deploy

### Hotfixes
Para correções urgentes:
```bash
# Criar branch hotfix a partir da main
git checkout main
git pull upstream main
git checkout -b hotfix/critical-bug-fix

# Desenvolver correção
# Testar extensivamente
# Abrir PR marcado como hotfix
```

## 📞 Suporte e Comunicação

### Canais de Comunicação
- **Issues**: Para bugs e feature requests
- **Discussions**: Para perguntas e discussões gerais
- **Email**: Para questões sensíveis ou privadas

### Tempo de Resposta
- **Issues de bug crítico**: 24 horas
- **Pull Requests**: 48 horas úteis
- **Issues gerais**: 72 horas úteis
- **Discussions**: Best effort

### Código de Conduta
- Seja respeitoso e profissional
- Foque no código, não na pessoa
- Aceite feedback construtivo
- Ajude outros contribuidores
- Mantenha discussões relevantes ao projeto

## 📚 Recursos Adicionais

### Documentação
- [README principal](./README.md)
- [API Documentation](./API/README.md)
- [Web Documentation](./Web/README.md)
- [Mobile Documentation](./Mobile/README.md)
- [Domain Documentation](./Domain/README.md)

### Ferramentas Úteis
- [Git Flow Cheatsheet](https://danielkummer.github.io/git-flow-cheatsheet/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Versioning](https://semver.org/)
- [Keep a Changelog](https://keepachangelog.com/)

### Aprendizado
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [React Best Practices](https://react.dev/learn)
- [React Native Guide](https://reactnative.dev/docs/getting-started)
- [.NET Best Practices](https://docs.microsoft.com/en-us/dotnet/standard/design-guidelines/)

---

Obrigado por contribuir com o CliniData! Juntos, estamos construindo uma plataforma que melhora o cuidado com a saúde. 🏥💙