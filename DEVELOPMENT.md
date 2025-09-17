# Como Configurar o Ambiente de Desenvolvimento - CliniData

## 📋 O que você vai fazer

Este guia vai te ajudar a configurar tudo que é necessário para trabalhar no projeto CliniData. Vamos instalar as ferramentas e rodar todos os 4 projetos (API, Web, Mobile e Domain).

## 🔧 O que você precisa instalar

### Para todos os projetos
- **Git**: [Download aqui](https://git-scm.com/downloads) - Para baixar e gerenciar o código
- **Node.js 18+**: [Download aqui](https://nodejs.org/) - Para rodar JavaScript
- **Visual Studio Code**: [Download aqui](https://code.visualstudio.com/) - Editor de código recomendado

### Para a API (.NET)
- **.NET 8.0 SDK**: [Download aqui](https://dotnet.microsoft.com/download/dotnet/8.0)
- **SQL Server LocalDB**: Vem com o Visual Studio ou baixe o SQL Server Express
- **Entity Framework Tools**:
  ```bash
  dotnet tool install --global dotnet-ef
  ```

### Para o Mobile (React Native)
- **Expo CLI**:
  ```bash
  npm install -g @expo/cli
  ```
- **Android Studio**: [Download aqui](https://developer.android.com/studio) (para testar no Android)
- **Xcode**: [Download aqui](https://developer.apple.com/xcode/) (para testar no iOS - só no Mac)

### Opcional (mas recomendado)
- **Docker Desktop**: [Download aqui](https://www.docker.com/products/docker-desktop) - Para rodar tudo em containers
- **Postman**: [Download aqui](https://www.postman.com/downloads/) - Para testar a API

## 🚀 Configuração Passo a Passo

### 1. Baixar o código
```bash
# Baixar o repositório
git clone https://github.com/ViniCosta1/CliniData.git
cd CliniData

# Verificar se baixou corretamente
ls -la
# Deve mostrar: API/, Domain/, Mobile/, Web/, README.md
```

### 2. Configurar a API (.NET)

```bash
# Ir para pasta da API
cd API

# Instalar dependências
dotnet restore

# Criar arquivo de configuração
cp appsettings.example.json appsettings.json
```

Edite o arquivo `appsettings.json` com suas configurações:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=(localdb)\\MSSQLLocalDB;Initial Catalog=CliniDataDB;Integrated Security=True"
  },
  "Jwt": {
    "Key": "sua-chave-secreta-de-pelo-menos-32-caracteres-aqui",
    "Issuer": "CliniData",
    "Audience": "CliniData-Users"
  }
}
```

```bash
# Criar o banco de dados
dotnet ef database update

# Rodar a API
dotnet run
```

A API vai estar rodando em: `https://localhost:5001`

### 3. Configurar o Web (React)

```bash
# Ir para pasta Web (em outro terminal)
cd ../Web

# Instalar dependências
npm install

# Criar arquivo de configuração
cp .env.example .env.local
```

Edite o arquivo `.env.local`:
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=CliniData
VITE_APP_VERSION=1.0.0
```

```bash
# Rodar o projeto Web
npm run dev
```

O site vai estar rodando em: `http://localhost:3000`

### 4. Configurar o Mobile (React Native)

```bash
# Ir para pasta Mobile (em outro terminal)
cd ../Mobile

# Instalar dependências
npm install

# Criar arquivo de configuração
cp .env.example .env.local
```

Edite o arquivo `.env.local`:
```env
EXPO_PUBLIC_API_URL=http://localhost:5000/api
EXPO_PUBLIC_APP_NAME=CliniData
```

```bash
# Rodar o projeto Mobile
expo start
```

O app vai abrir no Expo. Escaneie o QR code com seu celular para testar.

