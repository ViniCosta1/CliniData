# CliniData.Web

## 📋 Visão Geral

A **CliniData.Web** é a aplicação frontend desenvolvida em **React** para instituições médicas e profissionais de saúde gerenciarem consultas, pacientes, relatórios e operações administrativas. A aplicação oferece uma interface moderna, responsiva e intuitiva para maximizar a produtividade dos usuários.

## 🏗 Arquitetura Frontend

### Stack Tecnológico
- **React 18**: Biblioteca principal para criação da interface
- **TypeScript**: Tipagem estática para maior robustez
- **Vite**: Build tool moderna e rápida
- **React Router**: Roteamento client-side
- **React Query (TanStack Query)**: Gerenciamento de estado servidor
- **Zustand**: Gerenciamento de estado local
- **Tailwind CSS**: Framework CSS utility-first
- **Headless UI**: Componentes acessíveis sem estilo
- **React Hook Form**: Gerenciamento de formulários
- **Zod**: Validação de schemas
- **Axios**: Cliente HTTP

### Estrutura de Pastas
```
CliniData.Web/
├── public/                 # Arquivos estáticos
├── src/
│   ├── components/         # Componentes reutilizáveis
│   │   ├── ui/            # Componentes base (Button, Input, etc.)
│   │   ├── forms/         # Formulários específicos
│   │   └── layout/        # Componentes de layout
│   ├── pages/             # Páginas da aplicação
│   │   ├── auth/          # Autenticação
│   │   ├── dashboard/     # Dashboard principal
│   │   ├── patients/      # Gestão de pacientes
│   │   ├── appointments/  # Gestão de consultas
│   │   ├── doctors/       # Gestão de médicos
│   │   ├── institutions/  # Gestão de instituições
│   │   └── reports/       # Relatórios
│   ├── hooks/             # Custom hooks
│   ├── services/          # Serviços de API
│   ├── stores/            # Stores do Zustand
│   ├── types/             # Definições de tipos TypeScript
│   ├── utils/             # Utilitários
│   ├── lib/               # Configurações de bibliotecas
│   └── assets/            # Assets (imagens, ícones)
├── tests/                 # Testes
└── docs/                  # Documentação específica
```

## 🎨 Design System

### Componentes Base (ui/)

#### Button
```tsx
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'danger' | 'ghost';
  size: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ComponentType;
  rightIcon?: React.ComponentType;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  children,
  ...props
}) => {
  // Implementação do componente
};
```

#### Input
```tsx
interface InputProps {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ComponentType;
  rightIcon?: React.ComponentType;
  mask?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, ...props }, ref) => {
    // Implementação do componente
  }
);
```

#### Modal
```tsx
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showCloseButton?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  size = 'md',
  children
}) => {
  // Implementação com React Portal e Headless UI
};
```

### Tema e Cores
```css
:root {
  /* Primary Colors */
  --color-primary-50: #f0f9ff;
  --color-primary-500: #0ea5e9;
  --color-primary-600: #0284c7;
  --color-primary-900: #0c4a6e;
  
  /* Secondary Colors */
  --color-gray-50: #f9fafb;
  --color-gray-100: #f3f4f6;
  --color-gray-500: #6b7280;
  --color-gray-900: #111827;
  
  /* Status Colors */
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
  --color-info: #3b82f6;
}
```

## 🛣 Roteamento

### Estrutura de Rotas
```tsx
const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas Públicas */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Rotas Protegidas */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<DashboardPage />} />
            
            {/* Pacientes */}
            <Route path="patients" element={<PatientsPage />} />
            <Route path="patients/:id" element={<PatientDetailPage />} />
            <Route path="patients/new" element={<NewPatientPage />} />
            
            {/* Consultas */}
            <Route path="appointments" element={<AppointmentsPage />} />
            <Route path="appointments/:id" element={<AppointmentDetailPage />} />
            <Route path="appointments/new" element={<NewAppointmentPage />} />
            
            {/* Médicos */}
            <Route path="doctors" element={<DoctorsPage />} />
            <Route path="doctors/:id" element={<DoctorDetailPage />} />
            
            {/* Relatórios */}
            <Route path="reports" element={<ReportsPage />} />
            <Route path="reports/appointments" element={<AppointmentReportsPage />} />
            <Route path="reports/revenue" element={<RevenueReportsPage />} />
          </Route>
        </Route>
        
        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};
```

### Proteção de Rotas
```tsx
const ProtectedRoute: React.FC = () => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <Outlet />;
};
```

## 🔐 Autenticação e Autorização

### Hook useAuth
```tsx
interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'doctor' | 'institution';
  permissions: string[];
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
}

const useAuth = () => {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: true
  });
  
  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login(email, password);
      const { user, token } = response.data;
      
      setState({ user, token, isLoading: false });
      localStorage.setItem('token', token);
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };
  
  const logout = () => {
    setState({ user: null, token: null, isLoading: false });
    localStorage.removeItem('token');
  };
  
  return { ...state, login, logout };
};
```

### Controle de Permissões
```tsx
interface PermissionProps {
  permission: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const Permission: React.FC<PermissionProps> = ({
  permission,
  children,
  fallback = null
}) => {
  const { user } = useAuth();
  
  if (!user?.permissions.includes(permission)) {
    return fallback;
  }
  
  return <>{children}</>;
};

// Uso
<Permission permission="patients.create">
  <Button onClick={createPatient}>Novo Paciente</Button>
</Permission>
```

## 📊 Gerenciamento de Estado

### Estado Global (Zustand)
```tsx
interface AppState {
  // UI State
  sidebarCollapsed: boolean;
  theme: 'light' | 'dark';
  
  // User Preferences
  language: 'pt' | 'en';
  dateFormat: string;
  
  // Actions
  toggleSidebar: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setLanguage: (language: 'pt' | 'en') => void;
}

const useAppStore = create<AppState>((set) => ({
  sidebarCollapsed: false,
  theme: 'light',
  language: 'pt',
  dateFormat: 'dd/MM/yyyy',
  
  toggleSidebar: () => set((state) => ({ 
    sidebarCollapsed: !state.sidebarCollapsed 
  })),
  
  setTheme: (theme) => set({ theme }),
  setLanguage: (language) => set({ language }),
}));
```

### Estado do Servidor (React Query)
```tsx
// Hooks de dados
const usePatients = (filters?: PatientFilters) => {
  return useQuery({
    queryKey: ['patients', filters],
    queryFn: () => patientService.getPatients(filters),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

const usePatient = (id: string) => {
  return useQuery({
    queryKey: ['patient', id],
    queryFn: () => patientService.getPatient(id),
    enabled: !!id,
  });
};

// Mutations
const useCreatePatient = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: patientService.createPatient,
    onSuccess: () => {
      queryClient.invalidateQueries(['patients']);
      toast.success('Paciente criado com sucesso!');
    },
    onError: (error) => {
      toast.error('Erro ao criar paciente');
    },
  });
};
```

## 📱 Páginas Principais

### Dashboard
```tsx
const DashboardPage: React.FC = () => {
  const { data: stats, isLoading } = useDashboardStats();
  const { data: recentAppointments } = useRecentAppointments();
  const { data: todaySchedule } = useTodaySchedule();
  
  if (isLoading) return <DashboardSkeleton />;
  
  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard" />
      
      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatsCard
          title="Consultas Hoje"
          value={stats.todayAppointments}
          icon={CalendarIcon}
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Pacientes Ativos"
          value={stats.activePatients}
          icon={UsersIcon}
          trend={{ value: 5, isPositive: true }}
        />
        <StatsCard
          title="Receita Mensal"
          value={formatCurrency(stats.monthlyRevenue)}
          icon={CurrencyDollarIcon}
          trend={{ value: 8, isPositive: true }}
        />
        <StatsCard
          title="Taxa de Ocupação"
          value={`${stats.occupancyRate}%`}
          icon={ChartBarIcon}
          trend={{ value: 3, isPositive: false }}
        />
      </div>
      
      {/* Gráficos e Listas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader title="Consultas da Semana" />
          <CardContent>
            <AppointmentsChart data={stats.weeklyAppointments} />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader title="Agenda de Hoje" />
          <CardContent>
            <TodayScheduleList appointments={todaySchedule} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
```

### Gestão de Pacientes
```tsx
const PatientsPage: React.FC = () => {
  const [filters, setFilters] = useState<PatientFilters>({});
  const [selectedPatients, setSelectedPatients] = useState<string[]>([]);
  
  const { data: patients, isLoading } = usePatients(filters);
  const createPatientMutation = useCreatePatient();
  
  const handleCreatePatient = (data: CreatePatientData) => {
    createPatientMutation.mutate(data);
  };
  
  return (
    <div className="space-y-6">
      <PageHeader
        title="Pacientes"
        action={
          <Permission permission="patients.create">
            <Button
              onClick={() => setShowCreateModal(true)}
              leftIcon={PlusIcon}
            >
              Novo Paciente
            </Button>
          </Permission>
        }
      />
      
      {/* Filtros */}
      <Card>
        <CardContent>
          <PatientFilters
            filters={filters}
            onFiltersChange={setFilters}
          />
        </CardContent>
      </Card>
      
      {/* Tabela de Pacientes */}
      <Card>
        <CardContent>
          {isLoading ? (
            <TableSkeleton />
          ) : (
            <DataTable
              data={patients}
              columns={patientColumns}
              selectedRows={selectedPatients}
              onSelectionChange={setSelectedPatients}
              pagination={true}
              sorting={true}
              filtering={true}
            />
          )}
        </CardContent>
      </Card>
      
      {/* Modal de Criação */}
      <CreatePatientModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreatePatient}
        isLoading={createPatientMutation.isLoading}
      />
    </div>
  );
};
```

## 📋 Formulários

### React Hook Form + Zod
```tsx
const patientSchema = z.object({
  firstName: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  lastName: z.string().min(2, 'Sobrenome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(10, 'Telefone inválido'),
  cpf: z.string().refine(validateCPF, 'CPF inválido'),
  birthDate: z.date().max(new Date(), 'Data não pode ser futura'),
  address: z.object({
    street: z.string().min(1, 'Logradouro é obrigatório'),
    number: z.string().min(1, 'Número é obrigatório'),
    city: z.string().min(1, 'Cidade é obrigatória'),
    state: z.string().min(2, 'Estado é obrigatório'),
    zipCode: z.string().refine(validateZipCode, 'CEP inválido'),
  }),
});

type PatientFormData = z.infer<typeof patientSchema>;

const PatientForm: React.FC<PatientFormProps> = ({ onSubmit, initialData }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm<PatientFormData>({
    resolver: zodResolver(patientSchema),
    defaultValues: initialData,
  });
  
  const handleZipCodeChange = async (zipCode: string) => {
    if (validateZipCode(zipCode)) {
      const address = await addressService.getByZipCode(zipCode);
      setValue('address.street', address.street);
      setValue('address.city', address.city);
      setValue('address.state', address.state);
    }
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Nome"
          {...register('firstName')}
          error={errors.firstName?.message}
        />
        
        <Input
          label="Sobrenome"
          {...register('lastName')}
          error={errors.lastName?.message}
        />
        
        <Input
          label="Email"
          type="email"
          {...register('email')}
          error={errors.email?.message}
        />
        
        <Input
          label="Telefone"
          mask="(99) 99999-9999"
          {...register('phone')}
          error={errors.phone?.message}
        />
        
        <Input
          label="CPF"
          mask="999.999.999-99"
          {...register('cpf')}
          error={errors.cpf?.message}
        />
        
        <DatePicker
          label="Data de Nascimento"
          {...register('birthDate')}
          error={errors.birthDate?.message}
        />
      </div>
      
      {/* Endereço */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Endereço</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="CEP"
            mask="99999-999"
            {...register('address.zipCode')}
            onBlur={(e) => handleZipCodeChange(e.target.value)}
            error={errors.address?.zipCode?.message}
          />
          
          <div className="md:col-span-2">
            <Input
              label="Logradouro"
              {...register('address.street')}
              error={errors.address?.street?.message}
            />
          </div>
          
          <Input
            label="Número"
            {...register('address.number')}
            error={errors.address?.number?.message}
          />
          
          <Input
            label="Cidade"
            {...register('address.city')}
            error={errors.address?.city?.message}
          />
          
          <Input
            label="Estado"
            {...register('address.state')}
            error={errors.address?.state?.message}
          />
        </div>
      </div>
      
      <div className="flex justify-end space-x-4">
        <Button type="button" variant="secondary">
          Cancelar
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          Salvar
        </Button>
      </div>
    </form>
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

## 🚀 Configuração de Desenvolvimento

### Pré-requisitos
- **Node.js 18+**
- **npm ou yarn**
- **Git**

### Configuração Inicial
```bash
# Clone o repositório
git clone <repository-url>
cd CliniData/Web

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env.local

# Iniciar servidor de desenvolvimento
npm run dev
```

### Variáveis de Ambiente
```env
# .env.local
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=CliniData
VITE_APP_VERSION=1.0.0
VITE_ENABLE_MOCK=false
VITE_SENTRY_DSN=your-sentry-dsn
```

### Scripts Disponíveis
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint src --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "lint:fix": "eslint src --ext ts,tsx --fix",
    "type-check": "tsc --noEmit",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build"
  }
}
```

## 🧪 Testes

### Estrutura de Testes
```
tests/
├── components/           # Testes de componentes
├── pages/               # Testes de páginas
├── hooks/               # Testes de hooks
├── utils/               # Testes de utilitários
├── __mocks__/           # Mocks
└── setup.ts             # Configuração de testes
```

### Exemplo de Teste de Componente
```tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PatientForm } from '../PatientForm';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('PatientForm', () => {
  it('should submit form with valid data', async () => {
    const onSubmit = vi.fn();
    
    render(
      <PatientForm onSubmit={onSubmit} />,
      { wrapper: createWrapper() }
    );
    
    // Preencher campos
    fireEvent.change(screen.getByLabelText('Nome'), {
      target: { value: 'João' }
    });
    fireEvent.change(screen.getByLabelText('Sobrenome'), {
      target: { value: 'Silva' }
    });
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'joao@email.com' }
    });
    
    // Submeter formulário
    fireEvent.click(screen.getByText('Salvar'));
    
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        firstName: 'João',
        lastName: 'Silva',
        email: 'joao@email.com',
        // ... outros campos
      });
    });
  });
  
  it('should show validation errors for invalid data', async () => {
    render(
      <PatientForm onSubmit={vi.fn()} />,
      { wrapper: createWrapper() }
    );
    
    // Submeter sem preencher campos obrigatórios
    fireEvent.click(screen.getByText('Salvar'));
    
    await waitFor(() => {
      expect(screen.getByText('Nome deve ter pelo menos 2 caracteres')).toBeInTheDocument();
      expect(screen.getByText('Email inválido')).toBeInTheDocument();
    });
  });
});
```

## 📱 Responsividade

### Breakpoints Tailwind
```css
/* Mobile First Approach */
.container {
  @apply px-4;
  
  /* sm: 640px */
  @screen sm {
    @apply px-6;
  }
  
  /* md: 768px */
  @screen md {
    @apply px-8;
  }
  
  /* lg: 1024px */
  @screen lg {
    @apply px-12;
  }
  
  /* xl: 1280px */
  @screen xl {
    @apply px-16;
  }
}
```

### Layout Responsivo
```tsx
const DashboardLayout: React.FC = () => {
  const { sidebarCollapsed } = useAppStore();
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar - Hidden on mobile, slide-over */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform
        lg:relative lg:translate-x-0
        ${sidebarCollapsed ? '-translate-x-full lg:w-16' : 'translate-x-0'}
      `}>
        <Sidebar collapsed={sidebarCollapsed} />
      </div>
      
      {/* Main Content */}
      <div className={`
        flex-1 transition-all duration-200
        lg:ml-0
        ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'}
      `}>
        <Header />
        <main className="p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
      
      {/* Mobile Overlay */}
      {!sidebarCollapsed && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => useAppStore.getState().toggleSidebar()}
        />
      )}
    </div>
  );
};
```

## 🚀 Build e Deploy

### Build de Produção
```bash
# Build otimizado
npm run build

# Preview do build
npm run preview

# Análise do bundle
npm run build -- --analyze
```

### Configuração do Vite
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components'),
      '@pages': resolve(__dirname, 'src/pages'),
      '@hooks': resolve(__dirname, 'src/hooks'),
      '@services': resolve(__dirname, 'src/services'),
      '@utils': resolve(__dirname, 'src/utils'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['@headlessui/react', '@heroicons/react'],
        },
      },
    },
  },
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

### Docker
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

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 🔍 Monitoramento e Analytics

### Error Boundary
```tsx
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<
  React.PropsWithChildren<{}>,
  ErrorBoundaryState
> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false };
  }
  
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }
  
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    
    // Enviar erro para serviço de monitoramento
    if (import.meta.env.PROD) {
      Sentry.captureException(error, { extra: errorInfo });
    }
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Oops! Algo deu errado
            </h1>
            <p className="text-gray-600 mb-6">
              Ocorreu um erro inesperado. Nossa equipe foi notificada.
            </p>
            <Button onClick={() => window.location.reload()}>
              Recarregar Página
            </Button>
          </div>
        </div>
      );
    }
    
    return this.props.children;
  }
}
```

### Performance Monitoring
```tsx
// Hook para métricas de performance
const usePageMetrics = (pageName: string) => {
  useEffect(() => {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const loadTime = endTime - startTime;
      
      // Enviar métrica para analytics
      analytics.track('page_load_time', {
        page: pageName,
        load_time: loadTime,
      });
    };
  }, [pageName]);
};

// Uso em páginas
const DashboardPage: React.FC = () => {
  usePageMetrics('dashboard');
  
  // ... resto do componente
};
```

## 🤝 Guidelines de Desenvolvimento

### Convenções de Código
1. **Componentes**: PascalCase, um componente por arquivo
2. **Hooks**: camelCase começando com "use"
3. **Utilitários**: camelCase
4. **Constantes**: SCREAMING_SNAKE_CASE
5. **Props**: camelCase com tipos TypeScript explícitos

### Melhores Práticas
1. **Componentes pequenos e focados**: Uma responsabilidade por componente
2. **Props tipadas**: Sempre usar TypeScript para props
3. **Memoização inteligente**: React.memo, useMemo, useCallback quando necessário
4. **Error boundaries**: Cercar componentes críticos
5. **Loading states**: Sempre mostrar feedback visual
6. **Accessibility**: Seguir guidelines WCAG 2.1
7. **Testing**: Testes unitários para lógica crítica
