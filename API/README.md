# CliniData.API

# CliniData.API

## 📋 O que é

A **CliniData.API** é o servidor do sistema CliniData, feito em **.NET**. Este servidor é responsável por:

- Guardar e organizar todos os dados (pacientes, consultas, exames)
- Controlar quem pode acessar cada informação  
- Conectar o site dos médicos com o app dos pacientes
- Processar fotos de exames enviadas pelos pacientes

Pense nele como o "cérebro" do sistema - tudo passa por aqui.

## 🏗 Como o código está organizado

O código da API está dividido em pastas para facilitar a organização:

```
CliniData.API/
├── Controllers/          # Recebe as requisições (ex: buscar paciente)
├── Models/              # Modelos de dados (como são os dados que trafegam)
├── Services/            # Lógicas específicas (ex: enviar email)
├── Middleware/          # Intercepta requisições (ex: verificar login)
├── Configuration/       # Configurações da aplicação
├── Extensions/          # Funções auxiliares
└── Program.cs          # Arquivo principal que inicia tudo
```

### Como funciona
1. **Controllers** recebem pedidos do site/app (ex: "buscar paciente João")
2. **Services** fazem o trabalho pesado (ex: procurar no banco de dados)  
3. **Models** definem como os dados devem estar organizados
4. O resultado volta para quem pediu

## 🔌 Principais Funcionalidades (Endpoints)

A API oferece diferentes funcionalidades organizadas por área:

### 🏥 Gerenciar Instituições
- `GET /api/institutions` - Listar clínicas/hospitais cadastrados
- `POST /api/institutions` - Cadastrar nova instituição
- `PUT /api/institutions/{id}` - Atualizar dados da instituição
- `DELETE /api/institutions/{id}` - Remover instituição

### 👨‍⚕️ Gerenciar Médicos
- `GET /api/doctors` - Listar médicos cadastrados
- `POST /api/doctors` - Cadastrar novo médico
- `PUT /api/doctors/{id}` - Atualizar dados do médico
- `GET /api/doctors/{id}/appointments` - Ver consultas de um médico

### 🩺 Gerenciar Consultas
- `GET /api/appointments` - Listar consultas agendadas
- `POST /api/appointments` - Agendar nova consulta  
- `PUT /api/appointments/{id}` - Atualizar consulta (remarcar, cancelar)
- `GET /api/appointments/{id}/history` - Ver histórico da consulta

### 👤 Gerenciar Pacientes
- `GET /api/patients` - Listar pacientes cadastrados
- `POST /api/patients` - Cadastrar novo paciente
- `PUT /api/patients/{id}` - Atualizar dados do paciente
- `GET /api/patients/{id}/medical-history` - Ver histórico médico completo

### 🔬 Gerenciar Exames
- `GET /api/exams` - Listar exames realizados
- `POST /api/exams` - Registrar novo exame
- `PUT /api/exams/{id}` - Atualizar exame
- `POST /api/exams/upload` - Receber foto de exame do app

### 📊 Relatórios
- `GET /api/reports/appointments` - Relatório de consultas realizadas
- `GET /api/reports/procedures` - Relatório de procedimentos
- `GET /api/reports/expenses` - Relatório de gastos da clínica

## 🔐 Sistema de Login e Permissões

### Como funciona o login
- **Fazer login**: `POST /api/auth/login` - Recebe email e senha, devolve um "token"
- **Renovar acesso**: `POST /api/auth/refresh` - Renova o token quando expira
- **Sair do sistema**: `POST /api/auth/logout` - Invalida o token

### Tipos de usuário e o que cada um pode fazer
- **Admin**: Pode tudo - gerenciar instituições, médicos, relatórios
- **Clínica/Hospital**: Pode gerenciar seus próprios médicos e pacientes
- **Médico**: Pode ver suas consultas e os pacientes que atende
- **Paciente**: Pode ver apenas seu próprio histórico e exames

### Como usar o token
Depois do login, todas as requisições precisam incluir o token no header:
```
Authorization: Bearer SEU_TOKEN_AQUI
```

O token expira em algumas horas por segurança. Quando isso acontece, use o `/refresh` para pegar um novo.

## 💾 Banco de Dados

### O que usamos
- **Entity Framework Core**: Facilita trabalhar com o banco de dados em C#
- **SQL Server**: Onde os dados ficam guardados
- **LocalDB**: Versão simples do SQL Server para desenvolvimento

### Principais tabelas do banco
- **Institution**: Dados das clínicas e hospitais
- **Doctor**: Informações dos médicos (nome, CRM, especialidade)
- **Patient**: Dados dos pacientes (nome, CPF, contato, histórico)
- **Appointment**: Consultas agendadas e realizadas
- **Exam**: Exames médicos e seus resultados
- **MedicalHistory**: Histórico médico dos pacientes

### Como trabalhar com o banco
```csharp
// Exemplo: Como buscar um paciente por CPF
public class PatientService 
{
    private readonly CliniDataDbContext _context;
    
    public async Task<Patient> GetPatientByCpf(string cpf)
    {
        return await _context.Patients
            .FirstOrDefaultAsync(p => p.CPF == cpf);
    }
}
```

## 🚀 Como rodar o projeto

### O que você precisa ter instalado
- **.NET 8.0 SDK** - Para rodar código C#
- **SQL Server LocalDB** - Para o banco de dados (vem com Visual Studio)
- **Visual Studio 2022** ou **VS Code** - Para editar código

### Passo a passo para começar

1. **Baixar o código**
   ```bash
   git clone <url-do-repositorio>
   cd CliniData/API
   ```

2. **Instalar dependências**
   ```bash
   dotnet restore
   ```

3. **Configurar o banco de dados**
   
   Edite o arquivo `appsettings.json`:
   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Data Source=(localdb)\\MSSQLLocalDB;Initial Catalog=CliniDataDB;Integrated Security=True"
     },
     "Jwt": {
       "Key": "sua-chave-secreta-aqui-pelo-menos-32-caracteres",
       "Issuer": "CliniData",
       "Audience": "CliniData-Users"
     }
   }
   ```

4. **Criar o banco de dados**
   ```bash
   dotnet ef database update
   ```

5. **Rodar o projeto**
   ```bash
   dotnet run
   ```

   Acesse: `https://localhost:5001/swagger` para ver e testar a API

### Variáveis importantes
- `ASPNETCORE_ENVIRONMENT`: Use "Development" para desenvolvimento
- `CONNECTION_STRING`: String de conexão com o banco
- `JWT_SECRET`: Chave secreta para gerar tokens de login

## 🧪 Testes

### Como os testes estão organizados
```
CliniData.API.Tests/
├── Controllers/         # Testa se as rotas funcionam
├── Services/           # Testa a lógica de negócio  
├── Integration/        # Testa o sistema completo
└── Fixtures/          # Dados falsos para os testes
```

### Como rodar os testes
```bash
# Rodar todos os testes
dotnet test

# Ver quais partes do código estão sendo testadas
dotnet test --collect:"XPlat Code Coverage"

# Rodar só um tipo específico
dotnet test --filter "Category=Unit"
```

### Ferramentas que usamos
- **xUnit**: Para escrever e rodar testes
- **Moq**: Para simular dependências (ex: simular banco de dados)
- **FluentAssertions**: Para verificações mais legíveis
- **WebApplicationFactory**: Para testar a API completa

## 📝 Logs e Monitoramento

### Como configurar logs
O sistema registra o que acontece para ajudar na solução de problemas:

```csharp
// No Program.cs
builder.Services.AddLogging(config =>
{
    config.AddConsole();    // Mostra logs no console
    config.AddDebug();      // Logs para debug
});
```

### Tipos de log
- **Error**: Quando algo deu muito errado
- **Warning**: Quando algo pode dar problema
- **Information**: Informações normais do funcionamento
- **Debug**: Detalhes técnicos para investigação

### Verificação de saúde do sistema
```csharp
// Adiciona verificações automáticas
builder.Services.AddHealthChecks()
    .AddDbContextCheck<CliniDataDbContext>()    // Verifica se o banco está funcionando
    .AddSqlServer(connectionString);            // Verifica conexão com SQL Server
```

Acesse `/health` para ver se tudo está funcionando.

## 🔧 Deploy em Produção

### Docker (containerização)
Para rodar em qualquer servidor, use Docker:

```dockerfile
# Dockerfile básico
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY . .
EXPOSE 80
ENTRYPOINT ["dotnet", "CliniData.API.dll"]
```

```bash
# Construir e rodar
docker build -t clinidata-api .
docker run -p 8080:80 clinidata-api
```

### Pipeline de deploy
Recomendamos automatizar o processo:
1. **Build**: Compilar e testar código automaticamente
2. **Quality Check**: Verificar qualidade e cobertura de testes  
3. **Deploy**: Subir automaticamente para servidor de produção

## 📚 Documentação da API (Swagger)

### Como ver e testar a API
Quando você roda o projeto, acesse:
- **Desenvolvimento**: `https://localhost:5001/swagger`
- **Produção**: `https://api.clinidata.com/swagger`

O Swagger mostra todas as rotas disponíveis e permite testar cada uma diretamente no navegador.

### Collection do Postman
Se preferir usar Postman para testes:
```bash
curl -o CliniData.postman_collection.json https://api.clinidata.com/docs/postman
```

## 🤝 Dicas para Contribuir

### Regras importantes
1. **Mantenha simples**: Não complique desnecessariamente
2. **Teste suas mudanças**: Sempre escreva testes para novas funcionalidades  
3. **Documente**: Adicione comentários para código complexo
4. **Use async/await**: Para operações que demoram (banco, API externa)
5. **Registre logs**: Especialmente para erros e operações importantes

### Checklist antes de enviar código
- [ ] Código compila sem erros
- [ ] Testes passam
- [ ] Documentação foi atualizada se necessário
- [ ] Logs apropriados foram adicionados
- [ ] Tratamento de erro foi implementado

### Onde pedir ajuda
- Abra uma **Issue** no GitHub para bugs ou dúvidas
- Consulte a documentação das outras partes do projeto
- Verifique exemplos de código existente para manter consistência
