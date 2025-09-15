# Guia de Configuração do Ambiente de Desenvolvimento - CliniData

## 📋 Visão Geral

Este guia fornece instruções detalhadas para configurar o ambiente de desenvolvimento completo do CliniData, incluindo API .NET, aplicação Web React, aplicativo Mobile React Native e configuração do banco de dados.

## 🔧 Pré-requisitos

### Software Obrigatório

#### Para Todos os Projetos
- **Git**: [Download](https://git-scm.com/downloads)
- **Node.js 18+**: [Download](https://nodejs.org/) (recomendamos usar nvm)
- **Visual Studio Code**: [Download](https://code.visualstudio.com/)

#### Para API (.NET)
- **.NET 8.0 SDK**: [Download](https://dotnet.microsoft.com/download/dotnet/8.0)
- **SQL Server LocalDB**: Incluído com Visual Studio ou SQL Server Express
- **Entity Framework Core Tools**:
  ```bash
  dotnet tool install --global dotnet-ef
  ```

#### Para Mobile (React Native)
- **Expo CLI**:
  ```bash
  npm install -g @expo/cli
  ```
- **Android Studio**: [Download](https://developer.android.com/studio) (para desenvolvimento Android)
- **Xcode**: [Download](https://developer.apple.com/xcode/) (para desenvolvimento iOS - apenas macOS)

### Software Recomendado
- **Docker Desktop**: [Download](https://www.docker.com/products/docker-desktop)
- **Postman**: [Download](https://www.postman.com/downloads/) (para testes de API)
- **DB Browser for SQLite**: [Download](https://sqlitebrowser.org/) (para visualizar dados)

## 🚀 Configuração Rápida

### 1. Clone do Repositório
```bash
# Clone o repositório
git clone https://github.com/ViniCosta1/CliniData.git
cd CliniData

# Verifique a estrutura
ls -la
# Deve mostrar: API/, Domain/, Mobile/, Web/, README.md
```

### 2. Configuração da API (.NET)

#### 2.1. Verificar Instalação
```bash
# Verificar .NET
dotnet --version
# Deve mostrar: 8.0.x ou superior

# Verificar Entity Framework
dotnet ef --version
# Deve mostrar: 8.0.x ou superior
```

#### 2.2. Configurar Banco de Dados
```bash
cd API

# Criar arquivo de configuração local
cp appsettings.example.json appsettings.Development.json

# Editar appsettings.Development.json
```

**appsettings.Development.json**:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=(localdb)\\MSSQLLocalDB;Initial Catalog=CliniDataDB;Integrated Security=True;Trust Server Certificate=true"
  },
  "Jwt": {
    "Key": "sua-chave-secreta-super-segura-de-pelo-menos-32-caracteres",
    "Issuer": "CliniData",
    "Audience": "CliniData-Users",
    "ExpirationHours": 24
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*",
  "Cors": {
    "AllowedOrigins": ["http://localhost:3000", "http://localhost:19006"]
  }
}
```

#### 2.3. Restaurar Dependências
```bash
# Restaurar pacotes NuGet
dotnet restore

# Executar migrations (quando disponíveis)
dotnet ef database update

# Executar API
dotnet run
```

A API estará disponível em: `https://localhost:5001` ou `http://localhost:5000`

### 3. Configuração do Web (React)

#### 3.1. Instalar Dependências
```bash
cd ../Web

# Instalar dependências
npm install
# ou
yarn install
```

#### 3.2. Configurar Variáveis de Ambiente
```bash
# Criar arquivo de ambiente
cp .env.example .env.local
```

**.env.local**:
```env
# API Configuration
VITE_API_URL=http://localhost:5000/api
VITE_API_TIMEOUT=10000

# App Configuration
VITE_APP_NAME=CliniData
VITE_APP_VERSION=1.0.0
VITE_APP_DESCRIPTION=Plataforma de Gestão de Saúde

# Environment
VITE_NODE_ENV=development

# Features
VITE_ENABLE_MOCK_DATA=false
VITE_ENABLE_DEV_TOOLS=true

# External Services
VITE_SENTRY_DSN=your-sentry-dsn-here
VITE_GOOGLE_ANALYTICS_ID=your-ga-id-here
```

#### 3.3. Executar Aplicação
```bash
# Iniciar servidor de desenvolvimento
npm run dev
# ou
yarn dev
```

A aplicação estará disponível em: `http://localhost:3000`

### 4. Configuração do Mobile (React Native)

#### 4.1. Instalar Dependências
```bash
cd ../Mobile

# Instalar dependências
npm install
# ou
yarn install
```

#### 4.2. Configurar Variáveis de Ambiente
```bash
# Criar arquivo de ambiente
cp .env.example .env.local
```

**.env.local**:
```env
# API Configuration
EXPO_PUBLIC_API_URL=http://localhost:5000/api
EXPO_PUBLIC_API_TIMEOUT=10000

# App Configuration
EXPO_PUBLIC_APP_NAME=CliniData
EXPO_PUBLIC_APP_VERSION=1.0.0

# Environment
EXPO_PUBLIC_NODE_ENV=development

# Features
EXPO_PUBLIC_ENABLE_MOCK_DATA=false
EXPO_PUBLIC_ENABLE_DEV_TOOLS=true

# External Services
EXPO_PUBLIC_SENTRY_DSN=your-sentry-dsn-here
EXPO_PUBLIC_GOOGLE_VISION_API_KEY=your-google-vision-key
```

#### 4.3. Executar Aplicação
```bash
# Iniciar Expo Development Server
expo start

# Para Android
expo start --android

# Para iOS (apenas macOS)
expo start --ios

# Para Web
expo start --web
```

## 🛠 Configuração Avançada

### Docker (Opcional)

#### Docker Compose para Desenvolvimento
Crie um `docker-compose.dev.yml` na raiz:

```yaml
version: '3.8'

services:
  sqlserver:
    image: mcr.microsoft.com/mssql/server:2022-latest
    environment:
      SA_PASSWORD: "YourPassword123!"
      ACCEPT_EULA: "Y"
    ports:
      - "1433:1433"
    volumes:
      - sqlserver_data:/var/opt/mssql

  api:
    build:
      context: ./API
      dockerfile: Dockerfile.dev
    ports:
      - "5000:80"
    environment:
      - ConnectionStrings__DefaultConnection=Data Source=sqlserver;Initial Catalog=CliniDataDB;User ID=sa;Password=YourPassword123!;Trust Server Certificate=true
    depends_on:
      - sqlserver
    volumes:
      - ./API:/app
      - /app/bin
      - /app/obj

  web:
    build:
      context: ./Web
      dockerfile: Dockerfile.dev
    ports:
      - "3000:3000"
    environment:
      - VITE_API_URL=http://localhost:5000/api
    volumes:
      - ./Web:/app
      - /app/node_modules

volumes:
  sqlserver_data:
```

#### Executar com Docker
```bash
# Iniciar todos os serviços
docker-compose -f docker-compose.dev.yml up

# Apenas banco de dados
docker-compose -f docker-compose.dev.yml up sqlserver
```

### Configuração de IDEs

#### Visual Studio Code

**Extensões Recomendadas** (`.vscode/extensions.json`):
```json
{
  "recommendations": [
    "ms-dotnettools.csharp",
    "ms-dotnettools.vscode-dotnet-runtime",
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-typescript-next",
    "expo.vscode-expo-tools",
    "ms-vscode.vscode-json",
    "humao.rest-client"
  ]
}
```

**Configurações** (`.vscode/settings.json`):
```json
{
  "dotnet.defaultSolution": "./API/CliniData.API.sln",
  "typescript.preferences.includePackageJsonAutoImports": "auto",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "files.associations": {
    "*.env.*": "dotenv"
  },
  "eslint.workingDirectories": ["Web", "Mobile"]
}
```

**Tasks** (`.vscode/tasks.json`):
```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Start API",
      "type": "shell",
      "command": "dotnet",
      "args": ["run"],
      "options": {
        "cwd": "${workspaceFolder}/API"
      },
      "group": "build",
      "presentation": {
        "echo": true,
        "reveal": "always",
        "focus": false,
        "panel": "new"
      }
    },
    {
      "label": "Start Web",
      "type": "shell",
      "command": "npm",
      "args": ["run", "dev"],
      "options": {
        "cwd": "${workspaceFolder}/Web"
      },
      "group": "build",
      "presentation": {
        "echo": true,
        "reveal": "always",
        "focus": false,
        "panel": "new"
      }
    },
    {
      "label": "Start Mobile",
      "type": "shell",
      "command": "expo",
      "args": ["start"],
      "options": {
        "cwd": "${workspaceFolder}/Mobile"
      },
      "group": "build",
      "presentation": {
        "echo": true,
        "reveal": "always",
        "focus": false,
        "panel": "new"
      }
    }
  ]
}
```

#### Visual Studio 2022

**Configurações para API**:
1. Abra `API/CliniData.API.sln`
2. Defina `CliniData.API` como projeto de inicialização
3. Configure Multiple Startup Projects se necessário

### Ferramentas de Desenvolvimento

#### Scripts de Desenvolvimento

**scripts/dev-setup.sh** (Linux/macOS):
```bash
#!/bin/bash

echo "🚀 Configurando ambiente de desenvolvimento CliniData..."

# Verificar pré-requisitos
command -v node >/dev/null 2>&1 || { echo "❌ Node.js não encontrado"; exit 1; }
command -v dotnet >/dev/null 2>&1 || { echo "❌ .NET não encontrado"; exit 1; }

echo "✅ Pré-requisitos verificados"

# Configurar API
echo "🔧 Configurando API..."
cd API
dotnet restore
dotnet ef database update
cd ..

# Configurar Web
echo "🔧 Configurando Web..."
cd Web
npm install
cd ..

# Configurar Mobile
echo "🔧 Configurando Mobile..."
cd Mobile
npm install
cd ..

echo "✅ Configuração concluída!"
echo "📋 Próximos passos:"
echo "   1. cd API && dotnet run"
echo "   2. cd Web && npm run dev"
echo "   3. cd Mobile && expo start"
```

**scripts/dev-setup.bat** (Windows):
```batch
@echo off
echo 🚀 Configurando ambiente de desenvolvimento CliniData...

REM Verificar pré-requisitos
where node >nul 2>&1 || (echo ❌ Node.js não encontrado & exit /b 1)
where dotnet >nul 2>&1 || (echo ❌ .NET não encontrado & exit /b 1)

echo ✅ Pré-requisitos verificados

REM Configurar API
echo 🔧 Configurando API...
cd API
dotnet restore
dotnet ef database update
cd ..

REM Configurar Web
echo 🔧 Configurando Web...
cd Web
npm install
cd ..

REM Configurar Mobile
echo 🔧 Configurando Mobile...
cd Mobile
npm install
cd ..

echo ✅ Configuração concluída!
echo 📋 Próximos passos:
echo    1. cd API ^&^& dotnet run
echo    2. cd Web ^&^& npm run dev
echo    3. cd Mobile ^&^& expo start
```

#### Makefile (Opcional)
```makefile
.PHONY: install start-api start-web start-mobile test clean

# Instalar todas as dependências
install:
	@echo "📦 Instalando dependências..."
	cd API && dotnet restore
	cd Web && npm install
	cd Mobile && npm install

# Iniciar API
start-api:
	@echo "🚀 Iniciando API..."
	cd API && dotnet run

# Iniciar Web
start-web:
	@echo "🚀 Iniciando Web..."
	cd Web && npm run dev

# Iniciar Mobile
start-mobile:
	@echo "🚀 Iniciando Mobile..."
	cd Mobile && expo start

# Executar todos os testes
test:
	@echo "🧪 Executando testes..."
	cd API && dotnet test
	cd Web && npm test
	cd Mobile && npm test

# Limpar dependências e builds
clean:
	@echo "🧹 Limpando projeto..."
	cd API && dotnet clean
	cd Web && rm -rf node_modules dist
	cd Mobile && rm -rf node_modules
```

## 🧪 Configuração de Testes

### API (.NET)
```bash
cd API

# Executar testes
dotnet test

# Com cobertura
dotnet test --collect:"XPlat Code Coverage"

# Watch mode
dotnet watch test
```

### Web (React)
```bash
cd Web

# Executar testes
npm test

# Com cobertura
npm test -- --coverage

# Watch mode
npm test -- --watch
```

### Mobile (React Native)
```bash
cd Mobile

# Executar testes
npm test

# Com cobertura
npm test -- --coverage

# Watch mode
npm test -- --watchAll
```

## 🔍 Troubleshooting

### Problemas Comuns

#### API não inicia
```bash
# Verificar porta em uso
netstat -ano | findstr :5000

# Limpar e rebuildar
dotnet clean
dotnet build

# Verificar SDK
dotnet --list-sdks
```

#### Erro de conexão com banco
```bash
# Verificar SQL Server LocalDB
sqllocaldb info

# Recriar banco
dotnet ef database drop
dotnet ef database update
```

#### Web não carrega
```bash
# Limpar cache
npm run clean
rm -rf node_modules package-lock.json
npm install

# Verificar porta
lsof -i :3000
```

#### Mobile não conecta com API
- Verificar IP do computador no Expo
- Usar IP específico em vez de localhost
- Verificar firewall/antivírus

#### Erro de certificado HTTPS
```bash
# Windows
dotnet dev-certs https --trust

# macOS
dotnet dev-certs https --trust

# Linux
dotnet dev-certs https --trust --check
```

### Logs e Debug

#### API
```bash
# Logs detalhados
dotnet run --verbosity diagnostic

# Debug com VSCode
F5 (com launch.json configurado)
```

#### Web/Mobile
```bash
# Console do navegador
F12 -> Console

# React DevTools
# Chrome Extension: React Developer Tools
```

## 📝 Variáveis de Ambiente Completas

### API
```env
# appsettings.Development.json
{
  "ConnectionStrings": {
    "DefaultConnection": "connection-string-here"
  },
  "Jwt": {
    "Key": "sua-chave-jwt-aqui",
    "Issuer": "CliniData",
    "Audience": "CliniData-Users",
    "ExpirationHours": 24
  },
  "Cors": {
    "AllowedOrigins": ["http://localhost:3000", "http://localhost:19006"]
  },
  "Storage": {
    "Type": "Local", // ou "Azure", "AWS"
    "ConnectionString": "storage-connection-string"
  },
  "Email": {
    "Provider": "SMTP",
    "SmtpHost": "smtp.gmail.com",
    "SmtpPort": 587,
    "Username": "your-email@gmail.com",
    "Password": "your-app-password"
  }
}
```

### Web
```env
# .env.local
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=CliniData
VITE_APP_VERSION=1.0.0
VITE_NODE_ENV=development
VITE_ENABLE_MOCK_DATA=false
VITE_SENTRY_DSN=your-sentry-dsn
VITE_GOOGLE_ANALYTICS_ID=your-ga-id
VITE_FIREBASE_API_KEY=your-firebase-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
```

### Mobile
```env
# .env.local
EXPO_PUBLIC_API_URL=http://192.168.1.100:5000/api
EXPO_PUBLIC_APP_NAME=CliniData
EXPO_PUBLIC_APP_VERSION=1.0.0
EXPO_PUBLIC_NODE_ENV=development
EXPO_PUBLIC_SENTRY_DSN=your-sentry-dsn
EXPO_PUBLIC_GOOGLE_VISION_API_KEY=your-vision-key
EXPO_PUBLIC_FIREBASE_API_KEY=your-firebase-key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
```

## 🎯 Próximos Passos

Após completar a configuração:

1. **Executar todos os projetos**:
   - API: `cd API && dotnet run`
   - Web: `cd Web && npm run dev`
   - Mobile: `cd Mobile && expo start`

2. **Verificar funcionamento**:
   - API: `http://localhost:5000/swagger`
   - Web: `http://localhost:3000`
   - Mobile: Expo QR Code

3. **Configurar dados de teste**:
   - Criar usuário administrador
   - Popular dados básicos
   - Testar fluxo completo

4. **Configurar ferramentas extras**:
   - Postman collections
   - Database viewers
   - Git hooks

## 📞 Suporte

Em caso de problemas:
1. Consulte a seção de troubleshooting
2. Verifique issues no GitHub
3. Abra uma nova issue com detalhes do problema
4. Entre em contato com a equipe de desenvolvimento

---

**Sucesso na configuração!** 🎉 Agora você está pronto para contribuir com o CliniData!