# CliniData.Web

# CliniData.Web

## 📋 O que é

A **CliniData.Web** é o site feito em **React** que médicos e clínicas usam para:

- Cadastrar e gerenciar pacientes
- Agendar e acompanhar consultas médicas
- Ver relatórios e estatísticas  
- Gerenciar dados de médicos e instituições

É uma interface simples e moderna que funciona em qualquer navegador.

## 🏗 Como o projeto está organizado

### Tecnologias principais
- **React 18**: Para criar as telas e componentes
- **TypeScript**: Para ter menos bugs (adiciona tipos ao JavaScript)
- **Vite**: Para rodar o projeto rapidamente durante desenvolvimento
- **React Router**: Para navegar entre páginas
- **Tailwind CSS**: Para estilizar de forma rápida e consistente
- **React Hook Form**: Para criar formulários
- **Axios**: Para comunicar com a API

### Organização das pastas
```
CliniData.Web/
├── public/                 # Arquivos estáticos (imagens, ícones)
├── src/
│   ├── components/         # Peças reutilizáveis (botões, formulários)
│   │   ├── ui/            # Componentes básicos (Button, Input, etc.)
│   │   ├── forms/         # Formulários específicos
│   │   └── layout/        # Layout das páginas (header, sidebar)
│   ├── pages/             # Páginas completas da aplicação
│   │   ├── auth/          # Login, cadastro
│   │   ├── dashboard/     # Página inicial
│   │   ├── patients/      # Telas de pacientes
│   │   ├── appointments/  # Telas de consultas
│   │   ├── doctors/       # Telas de médicos
│   │   └── reports/       # Telas de relatórios
│   ├── hooks/             # Funções reutilizáveis
│   ├── services/          # Comunicação com a API
│   ├── stores/            # Dados globais da aplicação
│   ├── types/             # Definições de tipos TypeScript
│   ├── utils/             # Funções auxiliares
│   └── assets/            # Imagens, ícones
├── tests/                 # Testes
└── docs/                  # Documentação específica
```

## 🎨 Componentes Básicos

### Como criar um botão reutilizável
```tsx
// components/ui/Button.tsx
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit';
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'medium',
  loading = false,
  ...props
}) => {
  // Define cores baseado no variant
  const baseClasses = 'rounded-lg font-medium focus:outline-none';
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    danger: 'bg-red-600 text-white hover:bg-red-700'
  };
  
  const sizeClasses = {
    small: 'px-3 py-1 text-sm',
    medium: 'px-4 py-2',
    large: 'px-6 py-3 text-lg'
  };
  
  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]}`}
      onClick={onClick}
      disabled={loading}
      {...props}
    >
      {loading ? 'Carregando...' : children}
    </button>
  );
};
```

### Como criar um campo de entrada
```tsx
// components/ui/Input.tsx
interface InputProps {
  label?: string;
  error?: string;
  placeholder?: string;
  type?: 'text' | 'email' | 'password' | 'number';
  value?: string;
  onChange?: (value: string) => void;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  placeholder,
  type = 'text',
  value,
  onChange,
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      
      <input
        type={type}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className={`
          w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2
          ${error 
            ? 'border-red-300 focus:ring-red-500' 
            : 'border-gray-300 focus:ring-blue-500'
          }
        `}
        {...props}
      />
      
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
};
```

## 🛣 Como navegar entre páginas

### Configuração básica de rotas
```tsx
// App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Páginas que qualquer um pode acessar */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/cadastro" element={<RegisterPage />} />
        
        {/* Páginas que só usuários logados podem acessar */}
        <Route path="/" element={<ProtectedRoute />}>
          <Route index element={<DashboardPage />} />
          
          {/* Páginas de pacientes */}
          <Route path="pacientes" element={<PatientsPage />} />
          <Route path="pacientes/:id" element={<PatientDetailPage />} />
          <Route path="pacientes/novo" element={<NewPatientPage />} />
          
          {/* Páginas de consultas */}
          <Route path="consultas" element={<AppointmentsPage />} />
          <Route path="consultas/:id" element={<AppointmentDetailPage />} />
          <Route path="consultas/nova" element={<NewAppointmentPage />} />
          
          {/* Páginas de relatórios */}
          <Route path="relatorios" element={<ReportsPage />} />
        </Route>
        
        {/* Página de erro 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
```

### Como proteger páginas que precisam de login
```tsx
// components/ProtectedRoute.tsx
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const isLoggedIn = localStorage.getItem('token'); // Verifica se tem token
  
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  
  return <Outlet />; // Mostra a página se estiver logado
};
```

### Como navegar programaticamente
```tsx
import { useNavigate } from 'react-router-dom';

const MyComponent = () => {
  const navigate = useNavigate();
  
  const handleSuccess = () => {
    navigate('/pacientes'); // Vai para página de pacientes
  };
  
  const handleCancel = () => {
    navigate(-1); // Volta para página anterior
  };
};
```

## 🔐 Sistema de Login

### Hook simples para gerenciar login
```tsx
// hooks/useAuth.tsx
import { useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'doctor' | 'institution';
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Verificar se já está logado ao carregar a página
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);
  
  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      if (response.ok) {
        const { user, token } = await response.json();
        
        // Salvar dados do usuário
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
        
        return { success: true };
      } else {
        return { success: false, error: 'Email ou senha incorretos' };
      }
    } catch (error) {
      return { success: false, error: 'Erro de conexão' };
    }
  };
  
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };
  
  return { user, loading, login, logout };
};
```

### Como controlar permissões
```tsx
// components/Permission.tsx
interface PermissionProps {
  role: 'admin' | 'doctor' | 'institution';
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const Permission: React.FC<PermissionProps> = ({ 
  role, 
  children, 
  fallback = null 
}) => {
  const { user } = useAuth();
  
  if (user?.role !== role && user?.role !== 'admin') {
    return fallback;
  }
  
  return <>{children}</>;
};

// Uso em componentes
<Permission role="admin">
  <Button onClick={deletePatient}>Excluir Paciente</Button>
</Permission>
```

## 📊 Como buscar e gerenciar dados

### Hook simples para buscar dados da API
```tsx
// hooks/usePatients.tsx
import { useState, useEffect } from 'react';

export const usePatients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/patients', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setPatients(data);
        } else {
          setError('Erro ao carregar pacientes');
        }
      } catch (err) {
        setError('Erro de conexão');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPatients();
  }, []);
  
  const createPatient = async (patientData: any) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/patients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(patientData)
      });
      
      if (response.ok) {
        const newPatient = await response.json();
        setPatients(prev => [...prev, newPatient]);
        return { success: true };
      } else {
        return { success: false, error: 'Erro ao criar paciente' };
      }
    } catch (err) {
      return { success: false, error: 'Erro de conexão' };
    }
  };
  
  return { patients, loading, error, createPatient };
};
```

### Como usar em um componente
```tsx
// pages/PatientsPage.tsx
const PatientsPage = () => {
  const { patients, loading, error, createPatient } = usePatients();
  const [showCreateForm, setShowCreateForm] = useState(false);
  
  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;
  
  return (
    <div>
      <h1>Pacientes</h1>
      
      <Button onClick={() => setShowCreateForm(true)}>
        Novo Paciente
      </Button>
      
      <div className="grid gap-4">
        {patients.map(patient => (
          <div key={patient.id} className="border p-4 rounded">
            <h3>{patient.name}</h3>
            <p>{patient.email}</p>
          </div>
        ))}
      </div>
      
      {showCreateForm && (
        <CreatePatientForm 
          onSubmit={createPatient}
          onCancel={() => setShowCreateForm(false)}
        />
      )}
    </div>
  );
};
```

## 📱 Exemplo de Página Completa

### Dashboard simples
```tsx
// pages/DashboardPage.tsx
const DashboardPage = () => {
  const [stats, setStats] = useState({
    todayAppointments: 0,
    totalPatients: 0,
    monthlyRevenue: 0
  });
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/dashboard/stats', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Erro ao carregar estatísticas:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);
  
  if (loading) {
    return <div className="p-8">Carregando...</div>;
  }
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Consultas Hoje</h3>
          <p className="text-3xl font-bold text-blue-600">{stats.todayAppointments}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Total de Pacientes</h3>
          <p className="text-3xl font-bold text-green-600">{stats.totalPatients}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Receita Mensal</h3>
          <p className="text-3xl font-bold text-purple-600">
            R$ {stats.monthlyRevenue.toLocaleString()}
          </p>
        </div>
      </div>
      
      {/* Ações rápidas */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Ações Rápidas</h2>
        <div className="flex gap-4">
          <Button 
            onClick={() => navigate('/pacientes/novo')}
            variant="primary"
          >
            Novo Paciente
          </Button>
          <Button 
            onClick={() => navigate('/consultas/nova')}
            variant="secondary"
          >
            Agendar Consulta
          </Button>
          <Button 
            onClick={() => navigate('/relatorios')}
            variant="secondary"
          >
            Ver Relatórios
          </Button>
        </div>
      </div>
    </div>
  );
};
```

## 📋 Como criar formulários

### Formulário simples com validação
```tsx
// components/forms/PatientForm.tsx
import { useState } from 'react';

interface PatientData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  cpf: string;
  birthDate: string;
}

const PatientForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<PatientData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    cpf: '',
    birthDate: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  
  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Limpar erro quando usuário digita
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Nome é obrigatório';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Sobrenome é obrigatório';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!formData.email.includes('@')) {
      newErrors.email = 'Email inválido';
    }
    
    if (!formData.cpf.trim()) {
      newErrors.cpf = 'CPF é obrigatório';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const result = await onSubmit(formData);
      if (result.success) {
        alert('Paciente cadastrado com sucesso!');
        onCancel(); // Fechar formulário
      } else {
        alert('Erro: ' + result.error);
      }
    } catch (error) {
      alert('Erro ao salvar');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Cadastrar Paciente</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Nome"
            value={formData.firstName}
            onChange={(value) => handleChange('firstName', value)}
            error={errors.firstName}
            placeholder="Digite o nome"
          />
          
          <Input
            label="Sobrenome"
            value={formData.lastName}
            onChange={(value) => handleChange('lastName', value)}
            error={errors.lastName}
            placeholder="Digite o sobrenome"
          />
          
          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(value) => handleChange('email', value)}
            error={errors.email}
            placeholder="email@exemplo.com"
          />
          
          <Input
            label="Telefone"
            value={formData.phone}
            onChange={(value) => handleChange('phone', value)}
            placeholder="(11) 99999-9999"
          />
          
          <Input
            label="CPF"
            value={formData.cpf}
            onChange={(value) => handleChange('cpf', value)}
            error={errors.cpf}
            placeholder="123.456.789-00"
          />
          
          <Input
            label="Data de Nascimento"
            type="date"
            value={formData.birthDate}
            onChange={(value) => handleChange('birthDate', value)}
          />
        </div>
        
        <div className="flex gap-4 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={loading}
          >
            Salvar Paciente
          </Button>
        </div>
      </form>
    </div>
  );
};
```

## 📈 Componentes de Visualização

### Gráficos (Recharts)
```tsx
const AppointmentsChart: React.FC<{ data: ChartData[] }> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip 
          formatter={(value, name) => [value, 'Consultas']}
          labelFormatter={(date) => format(new Date(date), 'dd/MM/yyyy')}
        />
        <Line 
          type="monotone" 
          dataKey="appointments" 
          stroke="#0ea5e9" 
          strokeWidth={2}
          dot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
```

### Tabelas de Dados
```tsx
interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  selectedRows?: string[];
  onSelectionChange?: (selection: string[]) => void;
  pagination?: boolean;
  sorting?: boolean;
  filtering?: boolean;
}

const DataTable = <T,>({
  data,
  columns,
  selectedRows = [],
  onSelectionChange,
  pagination = false,
  sorting = false,
  filtering = false,
}: DataTableProps<T>) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    ...(sorting && { getSortedRowModel: getSortedRowModel() }),
    ...(filtering && { getFilteredRowModel: getFilteredRowModel() }),
    ...(pagination && { getPaginationRowModel: getPaginationRowModel() }),
  });
  
  return (
    <div className="space-y-4">
      {filtering && (
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Filtrar..."
            value={table.getState().globalFilter}
            onChange={(e) => table.setGlobalFilter(e.target.value)}
          />
        </div>
      )}
      
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-4 py-3 text-left">
                    {header.isPlaceholder ? null : (
                      <div
                        className={
                          header.column.getCanSort()
                            ? 'cursor-pointer select-none flex items-center space-x-1'
                            : ''
                        }
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {sorting && (
                          <SortIcon direction={header.column.getIsSorted()} />
                        )}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-t hover:bg-gray-50">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {pagination && (
        <TablePagination table={table} />
      )}
    </div>
  );
};
```

## 🚀 Como rodar o projeto

### O que você precisa ter instalado
- **Node.js 18+** - Para rodar JavaScript/React
- **npm** ou **yarn** - Para instalar dependências
- **Git** - Para baixar o código

### Passo a passo para começar

1. **Baixar o código**
   ```bash
   git clone <url-do-repositorio>
   cd CliniData/Web
   ```

2. **Instalar dependências**
   ```bash
   npm install
   # ou se usar yarn:
   yarn install
   ```

3. **Configurar variáveis**
   
   Crie um arquivo `.env.local` baseado no `.env.example`:
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_APP_NAME=CliniData
   VITE_APP_VERSION=1.0.0
   ```

4. **Rodar o projeto**
   ```bash
   npm run dev
   # ou:
   yarn dev
   ```
   
   Acesse: `http://localhost:3000`

### Comandos úteis
```bash
# Rodar em modo desenvolvimento
npm run dev

# Compilar para produção
npm run build

# Testar a versão de produção
npm run preview

# Verificar erros de código
npm run lint

# Corrigir erros automaticamente
npm run lint:fix

# Rodar testes
npm run test
```

## 🧪 Testes

### Como os testes estão organizados
```
tests/
├── components/           # Testa componentes individuais
├── pages/               # Testa páginas completas
├── hooks/               # Testa funções personalizadas
├── utils/               # Testa funções auxiliares
└── setup.ts             # Configuração dos testes
```

### Exemplo de teste simples
```tsx
// tests/components/Button.test.tsx
import { render, fireEvent, screen } from '@testing-library/react';
import { Button } from '../src/components/ui/Button';

describe('Button', () => {
  test('deve mostrar o texto correto', () => {
    render(<Button>Clique aqui</Button>);
    
    expect(screen.getByText('Clique aqui')).toBeInTheDocument();
  });
  
  test('deve chamar função quando clicado', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Clique</Button>);
    
    fireEvent.click(screen.getByText('Clique'));
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
  
  test('deve mostrar "Carregando..." quando loading=true', () => {
    render(<Button loading={true}>Salvar</Button>);
    
    expect(screen.getByText('Carregando...')).toBeInTheDocument();
  });
});
```

### Como rodar os testes
```bash
# Rodar todos os testes
npm run test

# Rodar testes e ver cobertura
npm run test:coverage

# Rodar testes em modo visual
npm run test:ui
```

## 📱 Como fazer o site funcionar em celular

### Configuração responsiva simples
```tsx
// Usar classes do Tailwind para diferentes tamanhos
<div className="
  grid 
  grid-cols-1        /* 1 coluna no celular */
  md:grid-cols-2     /* 2 colunas no tablet */
  lg:grid-cols-3     /* 3 colunas no desktop */
  gap-4 
">
  {/* Conteúdo */}
</div>

// Sidebar que esconde no celular
<div className="
  hidden           /* Escondido no celular */
  lg:block        /* Visível no desktop */
  w-64 
  bg-white 
  shadow
">
  {/* Menu lateral */}
</div>
```

### Layout responsivo
```tsx
const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Menu mobile */}
      <div className="lg:hidden">
        <button 
          onClick={() => setSidebarOpen(true)}
          className="p-4"
        >
          ☰ Menu
        </button>
      </div>
      
      {/* Sidebar desktop */}
      <div className="hidden lg:block fixed w-64 h-screen bg-white shadow">
        <Navigation />
      </div>
      
      {/* Conteúdo principal */}
      <div className="lg:ml-64 p-4">
        {children}
      </div>
      
      {/* Overlay mobile */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50">
          <div className="w-64 h-full bg-white">
            <button 
              onClick={() => setSidebarOpen(false)}
              className="p-4"
            >
              ✕ Fechar
            </button>
            <Navigation />
          </div>
        </div>
      )}
    </div>
  );
};
```

## 🚀 Deploy para Produção

### Compilar o projeto
```bash
# Criar versão de produção
npm run build

# Isso cria uma pasta 'dist' com todos os arquivos otimizados
```

### Configuração básica do Vite
```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  
  // Aliases para facilitar imports
  resolve: {
    alias: {
      '@': '/src',
      '@components': '/src/components',
      '@pages': '/src/pages',
      '@hooks': '/src/hooks',
    },
  },
  
  // Configuração de build
  build: {
    outDir: 'dist',
    sourcemap: true, // Para debug em produção
    rollupOptions: {
      output: {
        // Separar bibliotecas em chunks
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
        },
      },
    },
  },
  
  // Proxy para desenvolvimento (redirecionar API)
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});
```

### Docker para deploy
```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

# Copiar arquivos compilados
COPY --from=builder /app/dist /usr/share/nginx/html

# Configuração básica do Nginx
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 🤝 Dicas para Contribuir

### Regras para manter o código organizado
1. **Componentes pequenos**: Cada componente deve fazer apenas uma coisa
2. **Nomes claros**: Use nomes que expliquem o que faz (`UserProfile`, não `Profile`)
3. **TypeScript**: Sempre defina tipos para props e dados
4. **Responsivo**: Teste em celular, tablet e desktop
5. **Teste suas mudanças**: Pelo menos teste manualmente antes de enviar

### Estrutura de pastas padrão
```
src/
├── components/
│   ├── ui/              # Componentes básicos reutilizáveis
│   ├── forms/           # Formulários específicos
│   └── layout/          # Layout da aplicação
├── pages/               # Uma pasta por área (patients/, appointments/)
├── hooks/               # Lógica reutilizável
├── services/            # Comunicação com API
├── types/               # Definições TypeScript
└── utils/               # Funções auxiliares
```

### Exemplo de bom componente
```tsx
// ✅ Bom: componente pequeno, tipado, responsável por uma coisa
interface UserCardProps {
  user: {
    id: string;
    name: string;
    email: string;
  };
  onEdit: (id: string) => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, onEdit }) => {
  return (
    <div className="p-4 border rounded-lg">
      <h3 className="font-semibold">{user.name}</h3>
      <p className="text-gray-600">{user.email}</p>
      <Button onClick={() => onEdit(user.id)}>
        Editar
      </Button>
    </div>
  );
};

// ❌ Ruim: componente muito grande, faz muitas coisas
const UserManagement = () => {
  // 200 linhas de código aqui...
  // Busca usuários, valida formulário, faz requisições, etc.
};
```

### Checklist antes de enviar código
- [ ] Código compila sem erros (`npm run build`)
- [ ] Não há erros de lint (`npm run lint`)
- [ ] Testei no navegador e funciona
- [ ] Responsivo (funciona no celular)
- [ ] Nomes de variáveis estão claros
- [ ] Comentei partes complexas se necessário
