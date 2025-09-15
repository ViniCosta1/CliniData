# CliniData.Mobile

## 📋 Visão Geral

A **CliniData.Mobile** é o aplicativo móvel desenvolvido em **React Native** focado na experiência do paciente. O app permite que pacientes registrem exames através de fotos, acompanhem seu histórico médico, visualizem consultas agendadas e mantenham seus dados de saúde centralizados e organizados.

## 🏗 Arquitetura Mobile

### Stack Tecnológico
- **React Native 0.72+**: Framework principal para desenvolvimento móvel
- **TypeScript**: Tipagem estática para maior robustez
- **Expo (Managed Workflow)**: Toolchain para desenvolvimento rápido
- **React Navigation 6**: Navegação entre telas
- **React Query (TanStack Query)**: Gerenciamento de estado servidor
- **Zustand**: Gerenciamento de estado local
- **React Hook Form**: Gerenciamento de formulários
- **Zod**: Validação de schemas
- **Axios**: Cliente HTTP
- **React Native Paper**: Componentes de UI baseados em Material Design
- **Expo Camera**: Captura de fotos de exames
- **Expo FileSystem**: Manipulação de arquivos
- **Expo SecureStore**: Armazenamento seguro de dados

### Estrutura de Pastas
```
CliniData.Mobile/
├── app.json               # Configuração do Expo
├── babel.config.js        # Configuração do Babel
├── metro.config.js        # Configuração do Metro
├── src/
│   ├── components/        # Componentes reutilizáveis
│   │   ├── ui/           # Componentes base
│   │   ├── forms/        # Formulários específicos
│   │   ├── camera/       # Componentes de câmera
│   │   └── charts/       # Gráficos e visualizações
│   ├── screens/          # Telas da aplicação
│   │   ├── auth/         # Autenticação
│   │   ├── profile/      # Perfil do usuário
│   │   ├── exams/        # Gestão de exames
│   │   ├── appointments/ # Consultas
│   │   ├── history/      # Histórico médico
│   │   └── settings/     # Configurações
│   ├── navigation/       # Configuração de navegação
│   ├── hooks/           # Custom hooks
│   ├── services/        # Serviços de API
│   ├── stores/          # Stores do Zustand
│   ├── types/           # Definições de tipos TypeScript
│   ├── utils/           # Utilitários
│   ├── constants/       # Constantes
│   └── assets/          # Assets (imagens, ícones, fontes)
├── tests/               # Testes
└── docs/                # Documentação específica
```

## 📱 Principais Funcionalidades

### 1. Registro de Exames por Foto
- **Captura**: Fotografar documentos de exames médicos
- **Processamento**: OCR para extrair informações dos exames
- **Categorização**: Organizar exames por tipo e data
- **Sincronização**: Upload seguro para o servidor

### 2. Histórico Médico Centralizado
- **Cronologia**: Visualização cronológica de consultas e exames
- **Filtros**: Busca por data, médico, tipo de exame
- **Compartilhamento**: Envio de informações para médicos
- **Backup**: Sincronização automática com a nuvem

### 3. Agendamento de Consultas
- **Busca**: Encontrar médicos e especialistas
- **Disponibilidade**: Visualizar horários disponíveis
- **Agendamento**: Marcar consultas diretamente pelo app
- **Lembretes**: Notificações de consultas próximas

### 4. Perfil do Paciente
- **Dados Pessoais**: Gerenciar informações de contato
- **Informações Médicas**: Alergias, medicamentos, condições
- **Documentos**: RG, CPF, carteirinha do plano
- **Emergência**: Contatos de emergência

## 🧭 Navegação

### Estrutura de Navegação
```tsx
const RootNavigator: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <NavigationContainer>
      {user ? (
        <AuthenticatedNavigator />
      ) : (
        <UnauthenticatedNavigator />
      )}
    </NavigationContainer>
  );
};

const AuthenticatedNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          const iconName = getTabBarIcon(route.name);
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeStackNavigator}
        options={{ title: 'Início' }}
      />
      <Tab.Screen 
        name="Exams" 
        component={ExamsStackNavigator}
        options={{ title: 'Exames' }}
      />
      <Tab.Screen 
        name="Appointments" 
        component={AppointmentsStackNavigator}
        options={{ title: 'Consultas' }}
      />
      <Tab.Screen 
        name="History" 
        component={HistoryStackNavigator}
        options={{ title: 'Histórico' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileStackNavigator}
        options={{ title: 'Perfil' }}
      />
    </Tab.Navigator>
  );
};

const ExamsStackNavigator: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ExamsList" component={ExamsListScreen} />
      <Stack.Screen name="ExamDetail" component={ExamDetailScreen} />
      <Stack.Screen name="CameraCapture" component={CameraCaptureScreen} />
      <Stack.Screen name="ExamPreview" component={ExamPreviewScreen} />
      <Stack.Screen name="ExamForm" component={ExamFormScreen} />
    </Stack.Navigator>
  );
};
```

## 📷 Captura de Exames

### Componente de Câmera
```tsx
interface CameraCaptureProps {
  onCapture: (imageUri: string) => void;
  onCancel: () => void;
}

const CameraCaptureScreen: React.FC<CameraCaptureProps> = ({
  onCapture,
  onCancel
}) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [type, setType] = useState(CameraType.back);
  const [flashMode, setFlashMode] = useState(FlashMode.off);
  const cameraRef = useRef<Camera>(null);
  
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);
  
  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
        exif: true,
      });
      
      onCapture(photo.uri);
    }
  };
  
  if (hasPermission === null) {
    return <LoadingScreen />;
  }
  
  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>
          Permissão para usar a câmera é necessária
        </Text>
        <Button onPress={() => Linking.openSettings()}>
          Abrir Configurações
        </Button>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <Camera
        ref={cameraRef}
        style={styles.camera}
        type={type}
        flashMode={flashMode}
      >
        {/* Overlay para guiar o usuário */}
        <View style={styles.overlay}>
          <View style={styles.guideline}>
            <Text style={styles.guideText}>
              Posicione o documento dentro do quadro
            </Text>
          </View>
        </View>
        
        {/* Controles da câmera */}
        <View style={styles.controls}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => setFlashMode(
              flashMode === FlashMode.off ? FlashMode.on : FlashMode.off
            )}
          >
            <Icon 
              name={flashMode === FlashMode.off ? 'flash-off' : 'flash-on'} 
              size={24} 
              color="white" 
            />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.captureButton}
            onPress={takePicture}
          >
            <View style={styles.captureButtonInner} />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.button}
            onPress={() => setType(
              type === CameraType.back ? CameraType.front : CameraType.back
            )}
          >
            <Icon name="camera-reverse" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </Camera>
    </View>
  );
};
```

### Processamento de Imagem
```tsx
const ExamPreviewScreen: React.FC<RouteProp<ExamsStackParamList, 'ExamPreview'>> = ({
  route
}) => {
  const { imageUri } = route.params;
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState<ExamData | null>(null);
  
  const processImage = async () => {
    setIsProcessing(true);
    
    try {
      // Comprimir imagem
      const compressedImage = await ImageManipulator.manipulateAsync(
        imageUri,
        [{ resize: { width: 1024 } }],
        { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
      );
      
      // Enviar para OCR
      const ocrResult = await examService.processImageOCR(compressedImage.uri);
      
      // Extrair dados estruturados
      const examData = await examService.extractExamData(ocrResult.text);
      
      setExtractedData(examData);
    } catch (error) {
      console.error('Erro ao processar imagem:', error);
      showToast('Erro ao processar a imagem', 'error');
    } finally {
      setIsProcessing(false);
    }
  };
  
  useEffect(() => {
    processImage();
  }, []);
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: imageUri }} style={styles.image} />
        
        {isProcessing && (
          <View style={styles.processingOverlay}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={styles.processingText}>
              Processando imagem...
            </Text>
          </View>
        )}
      </View>
      
      {extractedData && (
        <Card style={styles.dataCard}>
          <Card.Title title="Dados Extraídos" />
          <Card.Content>
            <DataField label="Tipo de Exame" value={extractedData.type} />
            <DataField label="Data" value={extractedData.date} />
            <DataField label="Médico" value={extractedData.doctor} />
            <DataField label="Instituição" value={extractedData.institution} />
            
            {extractedData.results && (
              <View style={styles.results}>
                <Text style={styles.resultsTitle}>Resultados:</Text>
                {extractedData.results.map((result, index) => (
                  <DataField
                    key={index}
                    label={result.parameter}
                    value={`${result.value} ${result.unit}`}
                    warning={result.isAbnormal}
                  />
                ))}
              </View>
            )}
          </Card.Content>
          
          <Card.Actions>
            <Button mode="outlined" onPress={() => navigation.goBack()}>
              Refazer
            </Button>
            <Button 
              mode="contained" 
              onPress={() => navigation.navigate('ExamForm', { 
                imageUri, 
                extractedData 
              })}
            >
              Salvar Exame
            </Button>
          </Card.Actions>
        </Card>
      )}
    </ScrollView>
  );
};
```

## 📊 Telas Principais

### Tela Inicial (Home)
```tsx
const HomeScreen: React.FC = () => {
  const { data: dashboardData, isLoading } = useDashboardData();
  const { data: upcomingAppointments } = useUpcomingAppointments();
  const { data: recentExams } = useRecentExams();
  
  if (isLoading) {
    return <LoadingScreen />;
  }
  
  return (
    <ScrollView style={styles.container}>
      <Header title="Olá, João!" subtitle="Como está sua saúde hoje?" />
      
      {/* Cards de Ação Rápida */}
      <View style={styles.quickActions}>
        <QuickActionCard
          title="Novo Exame"
          subtitle="Fotografar documento"
          icon="camera"
          onPress={() => navigation.navigate('Exams', { screen: 'CameraCapture' })}
        />
        <QuickActionCard
          title="Agendar Consulta"
          subtitle="Marcar com médico"
          icon="calendar-plus"
          onPress={() => navigation.navigate('Appointments', { screen: 'Schedule' })}
        />
        <QuickActionCard
          title="Meu Histórico"
          subtitle="Ver exames anteriores"
          icon="history"
          onPress={() => navigation.navigate('History')}
        />
      </View>
      
      {/* Estatísticas */}
      <Card style={styles.statsCard}>
        <Card.Title title="Resumo da Saúde" />
        <Card.Content>
          <View style={styles.statsGrid}>
            <StatItem
              label="Exames este mês"
              value={dashboardData.monthlyExams}
              icon="test-tube"
            />
            <StatItem
              label="Próxima consulta"
              value={dashboardData.nextAppointment}
              icon="calendar"
            />
            <StatItem
              label="Medicamentos"
              value={dashboardData.activeMedications}
              icon="pill"
            />
            <StatItem
              label="Alergias"
              value={dashboardData.allergies}
              icon="alert"
            />
          </View>
        </Card.Content>
      </Card>
      
      {/* Consultas Próximas */}
      {upcomingAppointments && upcomingAppointments.length > 0 && (
        <Card style={styles.appointmentsCard}>
          <Card.Title 
            title="Próximas Consultas" 
            right={(props) => (
              <IconButton 
                {...props} 
                icon="arrow-right" 
                onPress={() => navigation.navigate('Appointments')}
              />
            )}
          />
          <Card.Content>
            {upcomingAppointments.slice(0, 3).map((appointment) => (
              <AppointmentItem
                key={appointment.id}
                appointment={appointment}
                onPress={() => navigation.navigate('Appointments', {
                  screen: 'Detail',
                  params: { id: appointment.id }
                })}
              />
            ))}
          </Card.Content>
        </Card>
      )}
      
      {/* Exames Recentes */}
      {recentExams && recentExams.length > 0 && (
        <Card style={styles.examsCard}>
          <Card.Title 
            title="Exames Recentes" 
            right={(props) => (
              <IconButton 
                {...props} 
                icon="arrow-right" 
                onPress={() => navigation.navigate('Exams')}
              />
            )}
          />
          <Card.Content>
            {recentExams.slice(0, 3).map((exam) => (
              <ExamItem
                key={exam.id}
                exam={exam}
                onPress={() => navigation.navigate('Exams', {
                  screen: 'Detail',
                  params: { id: exam.id }
                })}
              />
            ))}
          </Card.Content>
        </Card>
      )}
    </ScrollView>
  );
};
```

### Lista de Exames
```tsx
const ExamsListScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<ExamFilter>('all');
  const [sortBy, setSortBy] = useState<ExamSort>('date_desc');
  
  const {
    data: exams,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteExams({
    search: searchQuery,
    filter: selectedFilter,
    sort: sortBy,
  });
  
  const flatExams = useMemo(
    () => exams?.pages.flatMap(page => page.data) ?? [],
    [exams]
  );
  
  const renderExamItem = ({ item }: { item: Exam }) => (
    <ExamCard
      exam={item}
      onPress={() => navigation.navigate('ExamDetail', { id: item.id })}
      onShare={() => shareExam(item)}
    />
  );
  
  const renderFooter = () => {
    if (!isFetchingNextPage) return null;
    
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color={theme.colors.primary} />
      </View>
    );
  };
  
  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Buscar exames..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
      />
      
      <View style={styles.filters}>
        <FilterChip
          selected={selectedFilter === 'all'}
          onPress={() => setSelectedFilter('all')}
        >
          Todos
        </FilterChip>
        <FilterChip
          selected={selectedFilter === 'blood'}
          onPress={() => setSelectedFilter('blood')}
        >
          Sangue
        </FilterChip>
        <FilterChip
          selected={selectedFilter === 'imaging'}
          onPress={() => setSelectedFilter('imaging')}
        >
          Imagem
        </FilterChip>
        <FilterChip
          selected={selectedFilter === 'cardio'}
          onPress={() => setSelectedFilter('cardio')}
        >
          Cardio
        </FilterChip>
      </View>
      
      {isLoading ? (
        <ExamsListSkeleton />
      ) : (
        <FlatList
          data={flatExams}
          renderItem={renderExamItem}
          keyExtractor={(item) => item.id}
          onEndReached={() => hasNextPage && fetchNextPage()}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
      
      <FAB
        icon="camera"
        style={styles.fab}
        onPress={() => navigation.navigate('CameraCapture')}
      />
    </View>
  );
};
```

## 🔐 Autenticação e Segurança

### Gerenciamento de Autenticação
```tsx
interface AuthState {
  user: User | null;
  token: string | null;
  biometricEnabled: boolean;
  isLoading: boolean;
}

const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  biometricEnabled: false,
  isLoading: true,
  
  login: async (email: string, password: string) => {
    try {
      const response = await authService.login(email, password);
      const { user, token } = response.data;
      
      // Salvar token de forma segura
      await SecureStore.setItemAsync('auth_token', token);
      await SecureStore.setItemAsync('user_data', JSON.stringify(user));
      
      set({ user, token, isLoading: false });
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
  
  loginWithBiometrics: async () => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      
      if (!hasHardware || !isEnrolled) {
        throw new Error('Biometria não disponível');
      }
      
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Use sua biometria para acessar',
        cancelLabel: 'Cancelar',
      });
      
      if (result.success) {
        const token = await SecureStore.getItemAsync('auth_token');
        const userData = await SecureStore.getItemAsync('user_data');
        
        if (token && userData) {
          set({
            user: JSON.parse(userData),
            token,
            isLoading: false,
          });
          return { success: true };
        }
      }
      
      return { success: false, error: 'Autenticação falhou' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
  
  logout: async () => {
    await SecureStore.deleteItemAsync('auth_token');
    await SecureStore.deleteItemAsync('user_data');
    set({ user: null, token: null, isLoading: false });
  },
  
  enableBiometrics: async () => {
    const available = await LocalAuthentication.hasHardwareAsync();
    if (available) {
      set({ biometricEnabled: true });
      await SecureStore.setItemAsync('biometric_enabled', 'true');
    }
  },
}));
```

### Tela de Login
```tsx
const LoginScreen: React.FC = () => {
  const { login, loginWithBiometrics, biometricEnabled } = useAuthStore();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });
  
  const onSubmit = async (data: LoginFormData) => {
    const result = await login(data.email, data.password);
    
    if (!result.success) {
      showToast(result.error, 'error');
    }
  };
  
  const handleBiometricLogin = async () => {
    const result = await loginWithBiometrics();
    
    if (!result.success) {
      showToast(result.error, 'error');
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Image source={require('../../assets/logo.png')} style={styles.logo} />
            <Text style={styles.title}>CliniData</Text>
            <Text style={styles.subtitle}>Sua saúde em suas mãos</Text>
          </View>
          
          <View style={styles.form}>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  mode="outlined"
                  label="Email"
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  error={!!errors.email}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  left={<TextInput.Icon icon="email" />}
                />
              )}
            />
            {errors.email && (
              <HelperText type="error">{errors.email.message}</HelperText>
            )}
            
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  mode="outlined"
                  label="Senha"
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  error={!!errors.password}
                  secureTextEntry
                  left={<TextInput.Icon icon="lock" />}
                />
              )}
            />
            {errors.password && (
              <HelperText type="error">{errors.password.message}</HelperText>
            )}
            
            <Button
              mode="contained"
              onPress={handleSubmit(onSubmit)}
              loading={isSubmitting}
              disabled={isSubmitting}
              style={styles.loginButton}
            >
              Entrar
            </Button>
            
            {biometricEnabled && (
              <Button
                mode="outlined"
                onPress={handleBiometricLogin}
                icon="fingerprint"
                style={styles.biometricButton}
              >
                Entrar com Biometria
              </Button>
            )}
            
            <View style={styles.links}>
              <Button
                mode="text"
                onPress={() => navigation.navigate('ForgotPassword')}
              >
                Esqueci minha senha
              </Button>
              <Button
                mode="text"
                onPress={() => navigation.navigate('Register')}
              >
                Criar conta
              </Button>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
```

## 💾 Armazenamento Offline

### Configuração do Offline Storage
```tsx
// Configuração do SQLite para dados offline
const db = SQLite.openDatabase('clinidata.db');

const initializeDatabase = () => {
  db.transaction(tx => {
    // Tabela de exames
    tx.executeSql(`
      CREATE TABLE IF NOT EXISTS exams (
        id TEXT PRIMARY KEY,
        type TEXT NOT NULL,
        date TEXT NOT NULL,
        doctor TEXT,
        institution TEXT,
        image_uri TEXT,
        data TEXT,
        synced INTEGER DEFAULT 0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Tabela de consultas
    tx.executeSql(`
      CREATE TABLE IF NOT EXISTS appointments (
        id TEXT PRIMARY KEY,
        doctor_name TEXT NOT NULL,
        specialty TEXT,
        date TEXT NOT NULL,
        time TEXT NOT NULL,
        status TEXT DEFAULT 'scheduled',
        synced INTEGER DEFAULT 0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Tabela de sincronização
    tx.executeSql(`
      CREATE TABLE IF NOT EXISTS sync_queue (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        table_name TEXT NOT NULL,
        record_id TEXT NOT NULL,
        action TEXT NOT NULL,
        data TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `);
  });
};

// Hook para dados offline
const useOfflineData = <T>(
  queryKey: string[],
  fetchFn: () => Promise<T>,
  sqlQuery: string
) => {
  const [offlineData, setOfflineData] = useState<T | null>(null);
  const { isConnected } = useNetworkStatus();
  
  const query = useQuery({
    queryKey,
    queryFn: fetchFn,
    enabled: isConnected,
    onSuccess: (data) => {
      // Salvar dados offline
      db.transaction(tx => {
        tx.executeSql(sqlQuery, [JSON.stringify(data)]);
      });
    },
  });
  
  useEffect(() => {
    if (!isConnected && !query.data) {
      // Carregar dados offline
      db.transaction(tx => {
        tx.executeSql(sqlQuery, [], (_, { rows }) => {
          if (rows.length > 0) {
            setOfflineData(JSON.parse(rows.item(0).data));
          }
        });
      });
    }
  }, [isConnected]);
  
  return {
    ...query,
    data: query.data || offlineData,
  };
};
```

### Sincronização de Dados
```tsx
const useSyncService = () => {
  const { isConnected } = useNetworkStatus();
  
  const syncExams = async () => {
    if (!isConnected) return;
    
    return new Promise((resolve) => {
      db.transaction(tx => {
        // Buscar exames não sincronizados
        tx.executeSql(
          'SELECT * FROM exams WHERE synced = 0',
          [],
          async (_, { rows }) => {
            const exams = Array.from({ length: rows.length }, (_, i) => rows.item(i));
            
            for (const exam of exams) {
              try {
                await examService.uploadExam({
                  ...JSON.parse(exam.data),
                  imageUri: exam.image_uri,
                });
                
                // Marcar como sincronizado
                tx.executeSql(
                  'UPDATE exams SET synced = 1 WHERE id = ?',
                  [exam.id]
                );
              } catch (error) {
                console.error('Erro ao sincronizar exame:', error);
              }
            }
            
            resolve(true);
          }
        );
      });
    });
  };
  
  const syncAppointments = async () => {
    if (!isConnected) return;
    
    // Implementação similar para consultas
  };
  
  const syncAll = async () => {
    if (!isConnected) {
      showToast('Sem conexão com a internet', 'warning');
      return;
    }
    
    try {
      await Promise.all([
        syncExams(),
        syncAppointments(),
      ]);
      
      showToast('Dados sincronizados com sucesso', 'success');
    } catch (error) {
      showToast('Erro na sincronização', 'error');
    }
  };
  
  // Auto sync quando conectar
  useEffect(() => {
    if (isConnected) {
      syncAll();
    }
  }, [isConnected]);
  
  return {
    syncExams,
    syncAppointments,
    syncAll,
  };
};
```

## 🔔 Notificações Push

### Configuração de Notificações
```tsx
const useNotifications = () => {
  const [expoPushToken, setExpoPushToken] = useState<string>('');
  
  useEffect(() => {
    registerForPushNotificationsAsync().then(token => {
      setExpoPushToken(token);
      // Enviar token para o servidor
      userService.updatePushToken(token);
    });
    
    // Listener para notificações recebidas
    const notificationListener = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notificação recebida:', notification);
    });
    
    // Listener para quando usuário toca na notificação
    const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      const { screen, params } = response.notification.request.content.data;
      
      // Navegar para tela específica
      if (screen) {
        navigation.navigate(screen, params);
      }
    });
    
    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);
  
  const scheduleAppointmentReminder = async (appointment: Appointment) => {
    const trigger = new Date(appointment.dateTime);
    trigger.setHours(trigger.getHours() - 1); // 1 hora antes
    
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Lembrete de Consulta',
        body: `Consulta com ${appointment.doctorName} em 1 hora`,
        data: {
          screen: 'Appointments',
          params: { screen: 'Detail', params: { id: appointment.id } },
        },
      },
      trigger,
    });
  };
  
  const scheduleMedicationReminder = async (medication: Medication) => {
    // Agendar lembretes recorrentes para medicamentos
    for (const time of medication.times) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Hora do Medicamento',
          body: `Tomar ${medication.name} - ${medication.dosage}`,
          data: {
            screen: 'Medications',
            params: { id: medication.id },
          },
        },
        trigger: {
          hour: parseInt(time.split(':')[0]),
          minute: parseInt(time.split(':')[1]),
          repeats: true,
        },
      });
    }
  };
  
  return {
    expoPushToken,
    scheduleAppointmentReminder,
    scheduleMedicationReminder,
  };
};

async function registerForPushNotificationsAsync() {
  let token;
  
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      alert('Falha ao obter permissão para notificações push!');
      return;
    }
    
    token = (await Notifications.getExpoPushTokenAsync()).data;
  } else {
    alert('Use um dispositivo físico para push notifications');
  }
  
  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }
  
  return token;
}
```

## 🚀 Configuração de Desenvolvimento

### Pré-requisitos
- **Node.js 18+**
- **Expo CLI**: `npm install -g @expo/cli`
- **React Native CLI** (para desenvolvimento nativo)
- **Android Studio** (para desenvolvimento Android)
- **Xcode** (para desenvolvimento iOS - apenas macOS)

### Configuração Inicial
```bash
# Clone o repositório
git clone <repository-url>
cd CliniData/Mobile

# Instalar dependências
npm install

# Configurar arquivo de ambiente
cp .env.example .env.local

# Iniciar Expo Development Server
expo start
```

### Variáveis de Ambiente
```env
# .env.local
EXPO_PUBLIC_API_URL=http://localhost:5000/api
EXPO_PUBLIC_APP_NAME=CliniData
EXPO_PUBLIC_APP_VERSION=1.0.0
EXPO_PUBLIC_SENTRY_DSN=your-sentry-dsn
EXPO_PUBLIC_GOOGLE_VISION_API_KEY=your-google-vision-key
```

### Configuração do Expo (app.json)
```json
{
  "expo": {
    "name": "CliniData",
    "slug": "clinidata-mobile",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "automatic",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "assetBundlePatterns": ["**/*"],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.clinidata.mobile",
      "buildNumber": "1.0.0",
      "infoPlist": {
        "NSCameraUsageDescription": "Este app precisa acessar a câmera para fotografar exames médicos",
        "NSPhotoLibraryUsageDescription": "Este app precisa acessar a galeria para selecionar fotos de exames",
        "NSFaceIDUsageDescription": "Use Face ID para acessar seus dados médicos com segurança"
      }
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#FFFFFF"
      },
      "package": "com.clinidata.mobile",
      "versionCode": 1,
      "permissions": [
        "CAMERA",
        "READ_EXTERNAL_STORAGE",
        "WRITE_EXTERNAL_STORAGE",
        "USE_FINGERPRINT",
        "USE_BIOMETRIC"
      ]
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "plugins": [
      "expo-camera",
      "expo-image-picker",
      "expo-local-authentication",
      "expo-secure-store",
      "expo-sqlite",
      "@react-native-async-storage/async-storage"
    ]
  }
}
```

## 🧪 Testes

### Estrutura de Testes
```
tests/
├── components/          # Testes de componentes
├── screens/            # Testes de telas
├── hooks/              # Testes de hooks
├── services/           # Testes de serviços
├── __mocks__/          # Mocks
└── setup.ts            # Configuração de testes
```

### Exemplo de Teste de Componente
```tsx
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { ExamCard } from '../ExamCard';

const mockExam = {
  id: '1',
  type: 'Hemograma',
  date: '2023-10-15',
  doctor: 'Dr. Silva',
  institution: 'Hospital ABC',
  imageUri: 'file://path/to/image.jpg',
};

describe('ExamCard', () => {
  it('should render exam information correctly', () => {
    const onPress = jest.fn();
    
    const { getByText } = render(
      <ExamCard exam={mockExam} onPress={onPress} />
    );
    
    expect(getByText('Hemograma')).toBeTruthy();
    expect(getByText('Dr. Silva')).toBeTruthy();
    expect(getByText('Hospital ABC')).toBeTruthy();
    expect(getByText('15/10/2023')).toBeTruthy();
  });
  
  it('should call onPress when card is pressed', () => {
    const onPress = jest.fn();
    
    const { getByTestId } = render(
      <ExamCard exam={mockExam} onPress={onPress} />
    );
    
    fireEvent.press(getByTestId('exam-card'));
    
    expect(onPress).toHaveBeenCalledWith(mockExam);
  });
});
```

### Testes de Integração
```tsx
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ExamsListScreen } from '../ExamsListScreen';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        {children}
      </NavigationContainer>
    </QueryClientProvider>
  );
};

describe('ExamsListScreen', () => {
  it('should load and display exams', async () => {
    const { getByText, getByTestId } = render(
      <ExamsListScreen />,
      { wrapper: createWrapper() }
    );
    
    // Aguardar carregamento
    await waitFor(() => {
      expect(getByText('Hemograma')).toBeTruthy();
    });
    
    // Verificar se FAB está presente
    expect(getByTestId('camera-fab')).toBeTruthy();
  });
});
```

## 📱 Build e Deployment

### Build de Desenvolvimento
```bash
# Expo Development Build
expo run:android
expo run:ios

# Preview Build
expo build:android --type apk
expo build:ios --type simulator
```

### Build de Produção
```bash
# Android APK
expo build:android --type app-bundle

# iOS App Store
expo build:ios --type archive

# Usando EAS Build (recomendado)
eas build --platform android --profile production
eas build --platform ios --profile production
```

### Configuração EAS (eas.json)
```json
{
  "cli": {
    "version": ">= 3.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "app-bundle"
      }
    }
  },
  "submit": {
    "production": {
      "android": {
        "serviceAccountKeyPath": "./android-service-account.json",
        "track": "internal"
      },
      "ios": {
        "appleId": "your-apple-id@email.com",
        "ascAppId": "1234567890",
        "appleTeamId": "ABCD123456"
      }
    }
  }
}
```

## 🔍 Monitoramento e Analytics

### Configuração do Sentry
```tsx
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
  enabled: !__DEV__,
});

// Wrapper para capturar erros
const AppWithSentry = Sentry.wrap(App);
```

### Analytics de Uso
```tsx
import { Analytics } from 'expo-analytics';

const analytics = new Analytics('UA-XXXXXXXXX-1');

const useAnalytics = () => {
  const trackEvent = (category: string, action: string, label?: string) => {
    analytics.event(category, action, label);
  };
  
  const trackScreen = (screenName: string) => {
    analytics.screen(screenName);
  };
  
  const trackExamCapture = (examType: string) => {
    trackEvent('Exam', 'Capture', examType);
  };
  
  const trackAppointmentSchedule = (specialty: string) => {
    trackEvent('Appointment', 'Schedule', specialty);
  };
  
  return {
    trackEvent,
    trackScreen,
    trackExamCapture,
    trackAppointmentSchedule,
  };
};
```

## 🤝 Guidelines de Desenvolvimento

### Convenções de Código
1. **Componentes**: PascalCase, um componente por arquivo
2. **Hooks**: camelCase começando com "use"
3. **Telas**: PascalCase terminando com "Screen"
4. **Navegação**: Stack/Tab navegators organizados por feature
5. **Estilos**: StyleSheet.create ou styled-components

### Melhores Práticas
1. **Performance**: Usar FlatList para listas grandes, otimizar imagens
2. **Acessibilidade**: Implementar accessibility labels e hints
3. **Offline-first**: Priorizar funcionalidade offline
4. **Segurança**: Usar SecureStore para dados sensíveis
5. **UX Mobile**: Seguir guidelines de iOS e Android
6. **Bateria**: Otimizar uso de recursos (GPS, câmera, processamento)
7. **Conectividade**: Gerenciar estados de rede graciosamente
