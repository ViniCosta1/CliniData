# CliniData.API

## 📋 Visão Geral

A **CliniData.API** é o backend da plataforma de gestão integrada de saúde, desenvolvida em **.NET**. Esta API RESTful serve como o núcleo central do sistema, gerenciando todas as operações de dados, autenticação, autorização e lógica de negócio para instituições médicas, profissionais de saúde e pacientes.

## 🏗 Arquitetura

### Padrões de Design
- **Clean Architecture**: Separação clara entre camadas de apresentação, aplicação, domínio e infraestrutura
- **Repository Pattern**: Abstração do acesso a dados
- **Unit of Work**: Gerenciamento de transações
- **CQRS (Command Query Responsibility Segregation)**: Separação entre operações de leitura e escrita
- **Mediator Pattern**: Desacoplamento entre controllers e lógica de negócio

### Estrutura de Camadas
```
CliniData.API/
├── Controllers/          # Controladores REST
├── Models/              # DTOs e ViewModels
├── Services/            # Serviços de aplicação
├── Middleware/          # Middlewares customizados
├── Configuration/       # Configurações da aplicação
├── Extensions/          # Métodos de extensão
└── Program.cs          # Ponto de entrada da aplicação
```

## 🔌 Endpoints Principais

### 🏥 Instituições
- `GET /api/institutions` - Listar instituições
- `POST /api/institutions` - Criar nova instituição
- `PUT /api/institutions/{id}` - Atualizar instituição
- `DELETE /api/institutions/{id}` - Remover instituição

### 👨‍⚕️ Médicos
- `GET /api/doctors` - Listar médicos
- `POST /api/doctors` - Cadastrar médico
- `PUT /api/doctors/{id}` - Atualizar dados do médico
- `GET /api/doctors/{id}/appointments` - Consultas do médico

### 🩺 Consultas
- `GET /api/appointments` - Listar consultas
- `POST /api/appointments` - Agendar consulta
- `PUT /api/appointments/{id}` - Atualizar consulta
- `GET /api/appointments/{id}/history` - Histórico da consulta

### 👤 Pacientes
- `GET /api/patients` - Listar pacientes
- `POST /api/patients` - Cadastrar paciente
- `PUT /api/patients/{id}` - Atualizar dados do paciente
- `GET /api/patients/{id}/medical-history` - Histórico médico

### 🔬 Exames
- `GET /api/exams` - Listar exames
- `POST /api/exams` - Registrar exame
- `PUT /api/exams/{id}` - Atualizar exame
- `POST /api/exams/upload` - Upload de imagem de exame

### 📊 Relatórios
- `GET /api/reports/appointments` - Relatório de atendimentos
- `GET /api/reports/procedures` - Relatório de procedimentos
- `GET /api/reports/expenses` - Relatório de gastos

## 🔐 Autenticação e Autorização

### JWT (JSON Web Tokens)
- **Endpoint de Login**: `POST /api/auth/login`
- **Refresh Token**: `POST /api/auth/refresh`
- **Logout**: `POST /api/auth/logout`

### Roles e Permissões
- **Admin**: Acesso completo ao sistema
- **Institution**: Gestão da própria instituição
- **Doctor**: Gestão de consultas e pacientes
- **Patient**: Acesso ao próprio histórico médico

### Configuração de Autenticação
```csharp
services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = configuration["Jwt:Issuer"],
            ValidAudience = configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Jwt:Key"]))
        };
    });
```

## 💾 Banco de Dados

### Entity Framework Core
- **ORM**: Entity Framework Core
- **Database Provider**: SQL Server
- **Migrations**: Code-First approach

### Principais Entidades
- **Institution**: Dados das instituições médicas
- **Doctor**: Informações dos profissionais de saúde
- **Patient**: Dados dos pacientes
- **Appointment**: Consultas agendadas e realizadas
- **Exam**: Exames médicos e resultados
- **MedicalHistory**: Histórico médico dos pacientes

### Configuração do DbContext
```csharp
public class CliniDataDbContext : DbContext
{
    public DbSet<Institution> Institutions { get; set; }
    public DbSet<Doctor> Doctors { get; set; }
    public DbSet<Patient> Patients { get; set; }
    public DbSet<Appointment> Appointments { get; set; }
    public DbSet<Exam> Exams { get; set; }
    public DbSet<MedicalHistory> MedicalHistories { get; set; }
}
```

## 🚀 Configuração de Desenvolvimento

### Pré-requisitos
- **.NET 8.0 SDK** ou superior
- **SQL Server** (LocalDB para desenvolvimento)
- **Visual Studio 2022** ou **VS Code**

### Configuração Inicial
1. **Clone o repositório**
   ```bash
   git clone <repository-url>
   cd CliniData/API
   ```

2. **Restaurar dependências**
   ```bash
   dotnet restore
   ```

3. **Configurar appsettings.json**
   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Data Source=(localdb)\\MSSQLLocalDB;Initial Catalog=CliniDataDB;Integrated Security=True"
     },
     "Jwt": {
       "Key": "your-secret-key-here",
       "Issuer": "CliniData",
       "Audience": "CliniData-Users"
     }
   }
   ```

4. **Executar migrations**
   ```bash
   dotnet ef database update
   ```

5. **Executar a aplicação**
   ```bash
   dotnet run
   ```

### Variáveis de Ambiente
- `ASPNETCORE_ENVIRONMENT`: Development/Production
- `CONNECTION_STRING`: String de conexão do banco
- `JWT_SECRET`: Chave secreta para tokens JWT

## 🧪 Testes

### Estrutura de Testes
```
CliniData.API.Tests/
├── Controllers/         # Testes dos controllers
├── Services/           # Testes dos serviços
├── Integration/        # Testes de integração
└── Fixtures/          # Dados de teste
```

### Executar Testes
```bash
# Todos os testes
dotnet test

# Testes com cobertura
dotnet test --collect:"XPlat Code Coverage"

# Testes específicos
dotnet test --filter "Category=Unit"
```

### Ferramentas de Teste
- **xUnit**: Framework de testes
- **Moq**: Mocking framework
- **FluentAssertions**: Assertions mais legíveis
- **WebApplicationFactory**: Testes de integração

## 📝 Logging e Monitoramento

### Configuração de Logging
```csharp
builder.Services.AddLogging(config =>
{
    config.AddConsole();
    config.AddDebug();
    config.AddEventSourceLogger();
});
```

### Níveis de Log
- **Error**: Erros críticos da aplicação
- **Warning**: Avisos importantes
- **Information**: Informações gerais
- **Debug**: Informações de depuração

### Health Checks
```csharp
builder.Services.AddHealthChecks()
    .AddDbContextCheck<CliniDataDbContext>()
    .AddSqlServer(connectionString);
```

## 🔧 Configurações de Produção

### Docker
```dockerfile
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["CliniData.API.csproj", "."]
RUN dotnet restore
COPY . .
RUN dotnet build -c Release -o /app/build

FROM build AS publish
RUN dotnet publish -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "CliniData.API.dll"]
```

### CI/CD Pipeline
- **Build**: Compilação e testes automatizados
- **Quality Gate**: Análise de código e cobertura
- **Deploy**: Deploy automático para ambientes de staging/produção

## 📚 Documentação da API

### Swagger/OpenAPI
A documentação interativa da API está disponível em:
- **Development**: `https://localhost:5001/swagger`
- **Production**: `https://api.clinidata.com/swagger`

### Postman Collection
Importe a collection do Postman para testes manuais:
```bash
curl -o CliniData.postman_collection.json https://api.clinidata.com/docs/postman
```

## 🤝 Contribuindo

### Guidelines de Desenvolvimento
1. **Seguir padrões de Clean Code**
2. **Escrever testes para novas funcionalidades**
3. **Documentar APIs com XML comments**
4. **Usar async/await para operações I/O**
5. **Implementar logging adequado**

### Code Review Checklist
- [ ] Código segue padrões arquiteturais
- [ ] Testes unitários implementados
- [ ] Documentação atualizada
- [ ] Logging implementado
- [ ] Tratamento de erros adequado
