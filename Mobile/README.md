# CliniData.Mobile

# CliniData.Mobile

## 📋 O que é

O **CliniData.Mobile** é o aplicativo para celular feito em **React Native** que os pacientes usam para:

- Fotografar exames médicos e organizá-los digitalmente
- Ver seu histórico médico completo em um só lugar
- Agendar consultas com médicos
- Receber lembretes de consultas e medicamentos
- Compartilhar informações médicas com diferentes médicos

É um app simples e fácil de usar que funciona tanto no Android quanto no iPhone.

## 🏗 Como o projeto está organizado

### Tecnologias principais
- **React Native**: Para criar o app que funciona no Android e iPhone
- **Expo**: Facilita o desenvolvimento e testes
- **TypeScript**: Para ter menos bugs no código
- **React Navigation**: Para navegar entre as telas
- **React Hook Form**: Para criar formulários
- **Expo Camera**: Para usar a câmera do celular
- **SQLite**: Para guardar dados no celular quando não tem internet

### Organização das pastas
```
CliniData.Mobile/
├── app.json               # Configurações do app
├── src/
│   ├── components/        # Peças reutilizáveis
│   │   ├── ui/           # Componentes básicos (botões, inputs)
│   │   ├── forms/        # Formulários
│   │   └── camera/       # Componentes da câmera
│   ├── screens/          # Telas do aplicativo
│   │   ├── auth/         # Login e cadastro
│   │   ├── exams/        # Telas de exames
│   │   ├── appointments/ # Telas de consultas
│   │   ├── profile/      # Perfil do usuário
│   │   └── history/      # Histórico médico
│   ├── navigation/       # Configuração de navegação
│   ├── hooks/           # Funções reutilizáveis
│   ├── services/        # Comunicação com servidor
│   ├── types/           # Definições TypeScript
│   ├── utils/           # Funções auxiliares
│   └── assets/          # Imagens e ícones
├── tests/               # Testes
└── docs/                # Documentação
```

## 📱 Principais Funcionalidades

### 1. 📷 Fotografar Exames
**O que faz**: Permite que o paciente fotografe documentos de exames médicos

Como funciona:
- Paciente abre a câmera no app
- Fotografa o documento (exame de sangue, raio-x, etc.)
- App processa a imagem e extrai informações importantes
- Exame fica organizado no histórico do paciente

**Benefícios**:
- Não perde mais exames em papel
- Tudo fica organizado por data
- Pode compartilhar com qualquer médico

### 2. 📋 Histórico Médico Centralizado
**O que faz**: Mostra todos os exames e consultas em uma linha do tempo

Como funciona:
- Lista cronológica de tudo que aconteceu
- Filtros por tipo de exame, médico, data
- Busca rápida por palavra-chave
- Backup automático na nuvem

**Benefícios**:
- Histórico completo sempre à mão
- Médicos têm acesso rápido ao histórico
- Não precisa lembrar de levar papéis

### 3. 📅 Agendamento de Consultas
**O que faz**: Permite marcar consultas diretamente pelo app

Como funciona:
- Busca médicos por especialidade ou nome
- Vê horários disponíveis
- Agenda consulta diretamente
- Recebe confirmação por notificação

**Benefícios**:
- Não precisa ligar para clínicas
- Vê disponibilidade em tempo real
- Lembretes automáticos

### 4. 👤 Perfil do Paciente
**O que faz**: Centraliza todas as informações pessoais e médicas

Inclui:
- Dados pessoais (nome, contato, endereço)
- Informações médicas (alergias, medicamentos atuais)
- Documentos (RG, CPF, carteirinha do plano)
- Contatos de emergência

**Benefícios**:
- Todas as informações em um lugar
- Fácil de atualizar
- Médicos têm acesso imediato aos dados importantes

## 🧭 Como o app navega entre telas

### Estrutura básica
O app tem 5 telas principais que ficam na parte de baixo:

```
┌─────────┬─────────┬─────────┬─────────┬─────────┐
│  Início │ Exames  │Consultas│Histórico│ Perfil  │
└─────────┴─────────┴─────────┴─────────┴─────────┘
```

### Como é organizado no código
```tsx
// App.tsx - Estrutura principal
function App() {
  const { user } = useAuth();
  
  if (user) {
    return <MainTabNavigator />; // Usuário logado: mostra app principal
  } else {
    return <AuthNavigator />;    // Usuário não logado: mostra login
  }
}

// Navegação principal (após login)
function MainTabNavigator() {
  return (
    <BottomTabs>
      <Tab name="Home" component={HomeScreen} title="Início" />
      <Tab name="Exams" component={ExamsScreen} title="Exames" />
      <Tab name="Appointments" component={AppointmentsScreen} title="Consultas" />
      <Tab name="History" component={HistoryScreen} title="Histórico" />
      <Tab name="Profile" component={ProfileScreen} title="Perfil" />
    </BottomTabs>
  );
}

// Navegação de login (antes do login)
function AuthNavigator() {
  return (
    <Stack>
      <Screen name="Login" component={LoginScreen} />
      <Screen name="Register" component={RegisterScreen} />
      <Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </Stack>
  );
}
```

### Dentro de cada aba
Cada aba principal pode ter várias telas. Por exemplo, na aba "Exames":

```tsx
function ExamsNavigator() {
  return (
    <Stack>
      <Screen name="ExamsList" component={ExamsListScreen} />      {/* Lista de exames */}
      <Screen name="CameraCapture" component={CameraScreen} />     {/* Fotografar exame */}
      <Screen name="ExamDetail" component={ExamDetailScreen} />    {/* Ver detalhes */}
      <Screen name="ExamEdit" component={ExamEditScreen} />        {/* Editar exame */}
    </Stack>
  );
}
```

## 📷 Como funciona a câmera para exames

### Tela de captura simples
```tsx
// screens/CameraScreen.tsx
import { Camera } from 'expo-camera';
import { useState } from 'react';

function CameraScreen() {
  const [hasPermission, setHasPermission] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Pedir permissão para usar câmera quando tela carrega
  useEffect(() => {
    Camera.requestCameraPermissionsAsync().then(({ status }) => {
      setHasPermission(status === 'granted');
    });
  }, []);
  
  const takePhoto = async () => {
    if (cameraRef.current) {
      setIsLoading(true);
      
      // Fotografar
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,  // Boa qualidade mas não muito pesada
        base64: false,
      });
      
      // Processar foto e ir para próxima tela
      navigation.navigate('ExamPreview', { 
        imageUri: photo.uri 
      });
      
      setIsLoading(false);
    }
  };
  
  // Se não tem permissão, mostrar mensagem
  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <Text>Precisamos da permissão da câmera para fotografar exames</Text>
        <Button title="Permitir" onPress={() => Camera.requestCameraPermissionsAsync()} />
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <Camera 
        ref={cameraRef} 
        style={styles.camera}
        type={Camera.Constants.Type.back}
      >
        {/* Guias visuais para ajudar posicionar documento */}
        <View style={styles.overlay}>
          <View style={styles.guideline}>
            <Text style={styles.guideText}>
              Posicione o documento dentro do quadro
            </Text>
          </View>
        </View>
        
        {/* Botão de fotografar */}
        <View style={styles.controls}>
          <TouchableOpacity
            style={styles.captureButton}
            onPress={takePhoto}
            disabled={isLoading}
          >
            <Text style={styles.captureText}>
              {isLoading ? 'Processando...' : '📷 Fotografar'}
            </Text>
          </TouchableOpacity>
        </View>
      </Camera>
    </View>
  );
}
```

### Como processar a foto
```tsx
// screens/ExamPreviewScreen.tsx
function ExamPreviewScreen({ route }) {
  const { imageUri } = route.params;
  const [extractedData, setExtractedData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    processImage();
  }, []);
  
  const processImage = async () => {
    try {
      // 1. Comprimir imagem se necessário
      const compressedImage = await compressImage(imageUri);
      
      // 2. Enviar para servidor processar com OCR
      const response = await fetch('/api/exams/process-image', {
        method: 'POST',
        body: createFormData(compressedImage),
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      const result = await response.json();
      
      // 3. Mostrar dados extraídos para usuário confirmar
      setExtractedData({
        type: result.examType || '',
        date: result.examDate || '',
        doctor: result.doctorName || '',
        institution: result.institution || '',
        results: result.results || []
      });
      
    } catch (error) {
      alert('Erro ao processar imagem. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <ScrollView style={styles.container}>
      {/* Mostrar foto tirada */}
      <Image source={{ uri: imageUri }} style={styles.preview} />
      
      {loading ? (
        <Text>Processando imagem...</Text>
      ) : (
        <View style={styles.dataContainer}>
          <Text style={styles.title}>Dados extraídos:</Text>
          
          <TextInput
            label="Tipo de Exame"
            value={extractedData.type}
            onChangeText={(text) => setExtractedData({...extractedData, type: text})}
          />
          
          <TextInput
            label="Data do Exame"
            value={extractedData.date}
            onChangeText={(text) => setExtractedData({...extractedData, date: text})}
          />
          
          <TextInput
            label="Médico"
            value={extractedData.doctor}
            onChangeText={(text) => setExtractedData({...extractedData, doctor: text})}
          />
          
          {/* Botões */}
          <View style={styles.buttons}>
            <Button 
              title="Refazer Foto" 
              onPress={() => navigation.goBack()} 
              type="secondary"
            />
            <Button 
              title="Salvar Exame" 
              onPress={() => saveExam(extractedData)} 
              type="primary"
            />
          </View>
        </View>
      )}
    </ScrollView>
  );
}
```

## 📊 Exemplo de tela principal (Home)

```tsx
// screens/HomeScreen.tsx
function HomeScreen() {
  const [dashboardData, setDashboardData] = useState({
    nextAppointment: null,
    recentExams: [],
    upcomingReminders: []
  });
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    loadDashboardData();
  }, []);
  
  const loadDashboardData = async () => {
    try {
      const token = await getStoredToken();
      const response = await fetch('/api/patients/dashboard', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setDashboardData(data);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  return (
    <ScrollView style={styles.container}>
      {/* Header com saudação */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Olá, João! 👋</Text>
        <Text style={styles.subtitle}>Como está sua saúde hoje?</Text>
      </View>
      
      {/* Ações rápidas */}
      <View style={styles.quickActions}>
        <ActionCard
          title="Novo Exame"
          subtitle="Fotografar documento"
          icon="📷"
          onPress={() => navigation.navigate('Exams', { screen: 'Camera' })}
        />
        <ActionCard
          title="Agendar Consulta"
          subtitle="Marcar com médico"
          icon="📅"
          onPress={() => navigation.navigate('Appointments', { screen: 'Schedule' })}
        />
        <ActionCard
          title="Meu Histórico"
          subtitle="Ver exames anteriores"
          icon="📋"
          onPress={() => navigation.navigate('History')}
        />
      </View>
      
      {/* Próxima consulta */}
      {dashboardData.nextAppointment && (
        <Card style={styles.appointmentCard}>
          <Text style={styles.cardTitle}>Próxima Consulta</Text>
          <Text style={styles.doctorName}>
            Dr(a). {dashboardData.nextAppointment.doctorName}
          </Text>
          <Text style={styles.appointmentDate}>
            {formatDate(dashboardData.nextAppointment.date)} às {dashboardData.nextAppointment.time}
          </Text>
          <Button 
            title="Ver Detalhes"
            onPress={() => navigation.navigate('Appointments', { 
              screen: 'Detail', 
              params: { id: dashboardData.nextAppointment.id } 
            })}
          />
        </Card>
      )}
      
      {/* Exames recentes */}
      {dashboardData.recentExams.length > 0 && (
        <Card style={styles.examsCard}>
          <Text style={styles.cardTitle}>Exames Recentes</Text>
          {dashboardData.recentExams.slice(0, 3).map((exam) => (
            <ExamItem
              key={exam.id}
              exam={exam}
              onPress={() => navigation.navigate('Exams', {
                screen: 'Detail',
                params: { id: exam.id }
              })}
            />
          ))}
          <Button 
            title="Ver Todos"
            onPress={() => navigation.navigate('Exams')}
          />
        </Card>
      )}
    </ScrollView>
  );
}

// Componente de ação rápida
function ActionCard({ title, subtitle, icon, onPress }) {
  return (
    <TouchableOpacity style={styles.actionCard} onPress={onPress}>
      <Text style={styles.actionIcon}>{icon}</Text>
      <Text style={styles.actionTitle}>{title}</Text>
      <Text style={styles.actionSubtitle}>{subtitle}</Text>
    </TouchableOpacity>
  );
}
```

## 🔐 Login e segurança

### Sistema de login simples
```tsx
// hooks/useAuth.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Verificar se já está logado ao abrir o app
  useEffect(() => {
    checkLoginStatus();
  }, []);
  
  const checkLoginStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const userData = await AsyncStorage.getItem('user');
      
      if (token && userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Erro ao verificar login:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const login = async (email, password) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      if (response.ok) {
        const { user, token } = await response.json();
        
        // Salvar dados do usuário no celular
        await AsyncStorage.setItem('token', token);
        await AsyncStorage.setItem('user', JSON.stringify(user));
        
        setUser(user);
        return { success: true };
      } else {
        return { success: false, error: 'Email ou senha incorretos' };
      }
    } catch (error) {
      return { success: false, error: 'Erro de conexão' };
    }
  };
  
  const logout = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
    setUser(null);
  };
  
  return { user, loading, login, logout };
}
```

### Tela de login
```tsx
// screens/LoginScreen.tsx
function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  
  const handleLogin = async () => {
    if (!email || !password) {
      alert('Preencha email e senha');
      return;
    }
    
    setLoading(true);
    const result = await login(email, password);
    
    if (!result.success) {
      alert(result.error);
    }
    // Se sucesso, o app navegará automaticamente para telas principais
    
    setLoading(false);
  };
  
  return (
    <View style={styles.container}>
      <Image source={require('../assets/logo.png')} style={styles.logo} />
      <Text style={styles.title}>CliniData</Text>
      <Text style={styles.subtitle}>Sua saúde em suas mãos</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      
      <TouchableOpacity 
        style={styles.loginButton} 
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.loginButtonText}>
          {loading ? 'Entrando...' : 'Entrar'}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.linkText}>Não tem conta? Cadastre-se</Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
        <Text style={styles.linkText}>Esqueci minha senha</Text>
      </TouchableOpacity>
    </View>
  );
}
```

## 💾 Como o app funciona sem internet

O app consegue funcionar mesmo quando o celular não tem internet, salvando os dados localmente e sincronizando depois.

### Como salvar dados no celular
```tsx
// Usar SQLite para guardar dados localmente
import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase('clinidata.db');

// Salvar exame quando não tem internet
const saveExamOffline = async (exam) => {
  try {
    await db.executeSql(
      'INSERT INTO exams (id, type, date, doctor, image_path) VALUES (?, ?, ?, ?, ?)',
      [exam.id, exam.type, exam.date, exam.doctor, exam.imagePath]
    );
    
    alert('Exame salvo! Será sincronizado quando houver internet.');
  } catch (error) {
    alert('Erro ao salvar exame');
  }
};
```

### Sincronizar quando internet voltar
```tsx
// Detectar quando internet volta e sincronizar
import NetInfo from '@react-native-netinfo/netinfo';

const useSyncService = () => {
  useEffect(() => {
    NetInfo.addEventListener(state => {
      if (state.isConnected) {
        syncPendingData(); // Enviar dados salvos para servidor
      }
    });
  }, []);
  
  const syncPendingData = async () => {
    // Buscar dados salvos localmente
    const offlineExams = await getOfflineExams();
    
    // Enviar cada um para o servidor
    for (const exam of offlineExams) {
      try {
        await sendExamToServer(exam);
        await markAsSynced(exam.id);
      } catch (error) {
        console.log('Erro ao sincronizar:', error);
      }
    }
    
    alert('Dados sincronizados com sucesso!');
  };
};
```
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
## 🔔 Notificações e Lembretes

### Como configurar notificações simples
```tsx
// Pedir permissão para notificações
import * as Notifications from 'expo-notifications';

const requestPermission = async () => {
  const { status } = await Notifications.requestPermissionsAsync();
  
  if (status !== 'granted') {
    alert('Permita notificações para receber lembretes!');
    return false;
  }
  
  return true;
};

// Agendar lembrete de consulta
const scheduleReminder = async (appointment) => {
  const hasPermission = await requestPermission();
  if (!hasPermission) return;
  
  // Lembrete 1 hora antes
  const reminderTime = new Date(appointment.dateTime);
  reminderTime.setHours(reminderTime.getHours() - 1);
  
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Lembrete de Consulta 📅',
      body: `Consulta com ${appointment.doctorName} em 1 hora`,
    },
    trigger: reminderTime,
  });
};
```

## 🚀 Como rodar o projeto

### O que você precisa ter instalado
- **Node.js 18+** - Para rodar JavaScript
- **Expo CLI** - Para desenvolvimento React Native
- **Android Studio** - Para testar no Android (opcional)
- **Xcode** - Para testar no iOS - só no Mac (opcional)

### Passo a passo para começar

1. **Instalar Expo CLI**
   ```bash
   npm install -g @expo/cli
   ```

2. **Baixar o código**
   ```bash
   git clone <url-do-repositorio>
   cd CliniData/Mobile
   ```

3. **Instalar dependências**
   ```bash
   npm install
   ```

4. **Configurar variáveis**
   
   Crie um arquivo `.env.local`:
   ```env
   EXPO_PUBLIC_API_URL=http://localhost:5000/api
   EXPO_PUBLIC_APP_NAME=CliniData
   ```

5. **Rodar o projeto**
   ```bash
   expo start
   ```

6. **Testar no celular**
   - Instale o app "Expo Go" no seu celular
   - Escaneie o QR code que aparece no terminal
   - O app vai carregar no seu celular

### Comandos úteis
```bash
# Rodar em modo desenvolvimento
expo start

# Compilar para Android
expo run:android

# Compilar para iOS (só no Mac)
expo run:ios

# Limpar cache se der problema
expo start --clear
```

## 🧪 Como testar o app

### Teste simples de componente
```tsx
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from '../Button';

test('botão deve chamar função quando clicado', () => {
  const handlePress = jest.fn();
  
  const { getByText } = render(
    <Button onPress={handlePress}>Clique aqui</Button>
  );
  
  fireEvent.press(getByText('Clique aqui'));
  
  expect(handlePress).toHaveBeenCalledTimes(1);
});
```

### Como rodar os testes
```bash
# Rodar todos os testes
npm test

# Rodar testes em modo watch (atualiza automaticamente)
npm test -- --watch
```

## 📱 Como publicar o app

### Para Android (Google Play Store)
```bash
# Gerar APK
expo build:android --type app-bundle

# Ou usar EAS Build (mais moderno)
eas build --platform android --profile production
```

### Para iOS (App Store)
```bash
# Gerar arquivo para App Store (só no Mac)
expo build:ios --type archive

# Ou usar EAS Build
eas build --platform ios --profile production
```

## 🤝 Dicas para trabalhar no projeto

### Regras importantes
1. **Componentes simples**: Cada componente deve fazer uma coisa só
2. **Nomes claros**: Use nomes que expliquem o que faz (`UserProfile`, não `Profile`)
3. **Teste no celular**: Sempre teste no celular real, não só no computador
4. **Performance**: Use FlatList para listas grandes
5. **Offline**: Pense em como o app deve funcionar sem internet

### Estrutura recomendada
```
src/
├── components/          # Componentes reutilizáveis
├── screens/            # Telas do app (uma por arquivo)
├── hooks/              # Lógica reutilizável
├── services/           # Comunicação com servidor
├── types/              # Definições TypeScript
└── utils/              # Funções auxiliares
```

### Exemplo de componente bem feito
```tsx
// ✅ Bom: simples, focado, tipado
interface ExamCardProps {
  exam: {
    id: string;
    type: string;
    date: string;
    doctor: string;
  };
  onPress: () => void;
}

const ExamCard: React.FC<ExamCardProps> = ({ exam, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Text style={styles.title}>{exam.type}</Text>
      <Text style={styles.doctor}>Dr(a). {exam.doctor}</Text>
      <Text style={styles.date}>{exam.date}</Text>
    </TouchableOpacity>
  );
};

// ❌ Ruim: faz muitas coisas, difícil de entender
const MegaExamComponent = () => {
  // 500 linhas de código fazendo muitas coisas...
};
```

Este app é a interface dos pacientes com o sistema CliniData - mantenha-o simples e fácil de usar!
