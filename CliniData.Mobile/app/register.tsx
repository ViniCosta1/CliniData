import React, { useState, useEffect } from 'react'; // 1. Importamos o useEffect
import { 
    View, Text, TextInput, TouchableOpacity, 
    StyleSheet, Image, SafeAreaView, Alert,
    ScrollView, Platform  
} from 'react-native';
import { Link, router } from 'expo-router'; 
import api from './services/api'; 
import DateTimePicker from '@react-native-community/datetimepicker'; 
import axios from 'axios'; 

export default function RegisterScreen() {
    const [nome, setNome] = useState('');
    const [dataNascimento, setDataNascimento] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [sexo, setSexo] = useState(''); 
    const [cpf, setCpf] = useState('');
    const [telefone, setTelefone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState(''); 
    const [cep, setCep] = useState('');
    const [rua, setRua] = useState('');
    const [numero, setNumero] = useState('');
    const [complemento, setComplemento] = useState('');
    const [bairro, setBairro] = useState('');
    const [cidade, setCidade] = useState('');
    const [estado, setEstado] = useState(''); 
    const [isLoading, setIsLoading] = useState(false); 
    
    const logo = require('../assets/images/logoreal.png');

    const displayAlert = (title: string, message: string) => {
        if (Platform.OS === 'web') {
            alert(title + '\n' + message);
        } else {
            Alert.alert(title, message);
        }
    };

    // --- 5. CEP AUTOMÁTICO (API ViaCEP) ---
    useEffect(() => {
        const cepLimpo = cep.replace(/\D/g, ''); // Limpa o CEP
        if (cepLimpo.length === 8) {
            // Se o CEP tem 8 dígitos, busca na API
            buscarCEP(cepLimpo);
        }
    }, [cep]); // Isso roda toda vez que o 'cep' mudar

    const buscarCEP = async (cepLimpo: string) => {
        setIsLoading(true); // Mostra loading
        try {
            const response = await axios.get(`https://viacep.com.br/ws/${cepLimpo}/json/`);
            if (response.data && !response.data.erro) {
                // Preenche os campos!
                setRua(response.data.logradouro);
                setBairro(response.data.bairro);
                setCidade(response.data.localidade);
                setEstado(response.data.uf);
                // (O usuário ainda precisa preencher o Número)
            } else {
                displayAlert('Erro', 'CEP não encontrado.');
            }
        } catch (error) {
            displayAlert('Erro', 'Não foi possível buscar o CEP.');
        } finally {
            setIsLoading(false); // Para o loading
        }
    };
    // --- Fim do CEP ---

    // Funções de Máscara 
    const formatCPF = (text: string) => {
        const cleaned = text.replace(/\D/g, '').slice(0, 11);
        let masked = cleaned.replace(/(\d{3})(\d)/, '$1.$2');
        masked = masked.replace(/(\d{3})(\d)/, '$1.$2');
        masked = masked.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        return masked;
    };
    const formatTelefone = (text: string) => {
        const cleaned = text.replace(/\D/g, '').slice(0, 11); 
        let masked = cleaned.replace(/(\d{2})(\d)/, '($1) $2');
        masked = masked.replace(/(\d{5})(\d)/, '$1-$2');
        return masked;
    };
    const formatCEP = (text: string) => {
        const cleaned = text.replace(/\D/g, '').slice(0, 8); 
        const masked = cleaned.replace(/(\d{5})(\d)/, '$1-$2');
        return masked;
    };

    // Lógica de Registro
    const handleRegister = async () => {
        if (isLoading) return;
        if (!nome || !dataNascimento || !cpf || !password || !email) {
            displayAlert('Erro', 'Nome, Data de Nascimento, CPF, E-mail e Senha são obrigatórios.');
            return;
        }
        if (password !== confirmPassword) {
            displayAlert('Erro', 'As senhas não coincidem.');
            return;
        }
        setIsLoading(true);
        const dto = {
            nome, dataNascimento, sexo,
            cpf: cpf.replace(/\D/g, ''), 
            telefone: telefone.replace(/\D/g, ''), 
            email, password, rua, numero, complemento, bairro, cidade, estado,
            cep: cep.replace(/\D/g, ''), 
        };
        try {
            await api.post('/Register', dto); 
            displayAlert(
                'Sucesso!', 
                'Usuário cadastrado com sucesso. Você será enviado para a tela de Login.',
            );
            router.replace('/'); // Volta para o Login
        } catch (error: any) {
            let msg = 'Não foi possível fazer o cadastro.';
            if (error.response && error.response.data) {
                msg = error.response.data.message || 'Erro nos dados. Verifique se o CPF/Email já existe.';
            } else if (error.request) {
                msg = 'Não foi possível conectar ao servidor.';
            }
            displayAlert('Erro no Cadastro', msg);
        } finally {
            setIsLoading(false); 
        }
    };
    
    // Função para voltar ao Login
    const handleGoToLogin = () => {
        router.replace('/');
    };

    // Lógica do Calendário
    const onDateChange = (event: any, selectedDate?: Date) => {
        const currentDate = selectedDate || dataNascimento;
        setShowDatePicker(Platform.OS === 'ios'); 
        setDataNascimento(currentDate);
        if (event.type === 'set' || Platform.OS === 'ios') {
             setShowDatePicker(false);
             setDataNascimento(currentDate);
        } else {
             setShowDatePicker(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.formContainer}>
                    <Image source={logo} style={styles.logo} />
                    <Text style={styles.title}>Cadastro de Paciente</Text>

                    {/* --- DADOS PESSOAIS --- */}
                    <TextInput style={styles.input} placeholder="Nome Completo*" placeholderTextColor="#aaa" value={nome} onChangeText={setNome} />
                    
                    <TouchableOpacity style={styles.datePickerButton} onPress={() => setShowDatePicker(true)}>
                        <Text style={styles.datePickerText}>
                            Data de Nascimento*: {dataNascimento.toLocaleDateString('pt-BR')}
                        </Text>
                    </TouchableOpacity>
                    {showDatePicker && (
                        <DateTimePicker 
                            value={dataNascimento} 
                            mode={'date'} 
                            display="default"
                            onChange={onDateChange}
                        />
                    )}

                    <TextInput style={styles.input} placeholder="CPF*" placeholderTextColor="#aaa" value={cpf} onChangeText={(t) => setCpf(formatCPF(t))} keyboardType="numeric" maxLength={14} />
                    
                    {/* --- 6. CAMPO 'SEXO' DINÂMICO --- */}
                    <Text style={styles.label}>Sexo</Text>
                    <View style={styles.sexoContainer}>
                        <TouchableOpacity 
                            style={[styles.sexoButton, sexo === 'Masculino' && styles.sexoButtonActive]}
                            onPress={() => setSexo('Masculino')}
                        >
                            <Text style={[styles.sexoButtonText, sexo === 'Masculino' && styles.sexoButtonTextActive]}>Masculino</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={[styles.sexoButton, sexo === 'Feminino' && styles.sexoButtonActive]}
                            onPress={() => setSexo('Feminino')}
                        >
                            <Text style={[styles.sexoButtonText, sexo === 'Feminino' && styles.sexoButtonTextActive]}>Feminino</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={[styles.sexoButton, sexo === 'Outro' && styles.sexoButtonActive]}
                            onPress={() => setSexo('Outro')}
                        >
                            <Text style={[styles.sexoButtonText, sexo === 'Outro' && styles.sexoButtonTextActive]}>Outro</Text>
                        </TouchableOpacity>
                    </View>
                    
                    <TextInput style={styles.input} placeholder="Telefone (ex: (11) 98765-4321)" placeholderTextColor="#aaa" value={telefone} onChangeText={(t) => setTelefone(formatTelefone(t))} keyboardType="numeric" maxLength={15} />

                    {/* --- DADOS DE LOGIN --- */}
                    <TextInput style={styles.input} placeholder="E-mail*" placeholderTextColor="#aaa" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
                    <TextInput style={styles.input} placeholder="Senha*" placeholderTextColor="#aaa" value={password} onChangeText={setPassword} secureTextEntry />
                    <TextInput style={styles.input} placeholder="Repita a Senha*" placeholderTextColor="#aaa" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry />

                    {/* --- DADOS DE ENDEREÇO (AUTOMÁTICO) --- */}
                    <TextInput style={styles.input} placeholder="CEP (ex: 01001-000)" placeholderTextColor="#aaa" value={cep} onChangeText={(t) => setCep(formatCEP(t))} keyboardType="numeric" maxLength={9} />
                    <TextInput style={styles.input} placeholder="Rua" placeholderTextColor="#aaa" value={rua} onChangeText={setRua} />
                    <TextInput style={styles.input} placeholder="Número" placeholderTextColor="#aaa" value={numero} onChangeText={setNumero} keyboardType="numeric" />
                    <TextInput style={styles.input} placeholder="Complemento (Apto, Bloco, etc.)" placeholderTextColor="#aaa" value={complemento} onChangeText={setComplemento} />
                    <TextInput style={styles.input} placeholder="Bairro" placeholderTextColor="#aaa" value={bairro} onChangeText={setBairro} />
                    <TextInput style={styles.input} placeholder="Cidade" placeholderTextColor="#aaa" value={cidade} onChangeText={setCidade} />
                    <TextInput style={styles.input} placeholder="Estado (UF)" placeholderTextColor="#aaa" value={estado} onChangeText={setEstado} maxLength={2} autoCapitalize="characters" />

                    {/* --- Botões --- */}
                    <TouchableOpacity 
                        style={[styles.button, isLoading && styles.buttonDisabled]}
                        onPress={handleRegister}
                        disabled={isLoading}
                    >
                        <Text style={styles.buttonText}>{isLoading ? 'Cadastrando...' : 'Finalizar Cadastro'}</Text> 
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={styles.linkButton} onPress={handleGoToLogin} disabled={isLoading}>
                        <Text style={styles.linkText}>Já possui uma conta? Faça login</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

// Estilos
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f7f7f7' },
    scrollContainer: { justifyContent: 'center', alignItems: 'center', paddingVertical: 20 },
    formContainer: { width: '90%', padding: 20, backgroundColor: '#fff', borderRadius: 10, alignItems: 'center', shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.23, shadowRadius: 2.62, elevation: 4 },
    logo: { width: 70, height: 70, resizeMode: 'contain', marginBottom: 20 },
    title: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 20 },
    label: { // Label para o 'Sexo'
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
        width: '100%', 
    },
    input: { width: '100%', height: 50, backgroundColor: '#fff', borderColor: '#ddd', borderWidth: 1, borderRadius: 8, paddingHorizontal: 15, marginBottom: 15, fontSize: 16 },
    datePickerButton: { width: '100%', height: 50, backgroundColor: '#fff', borderColor: '#ddd', borderWidth: 1, borderRadius: 8, paddingHorizontal: 15, marginBottom: 15, justifyContent: 'center' },
    datePickerText: { fontSize: 16, color: '#333' },
    // --- Estilos para os Botões de Sexo ---
    sexoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 15,
    },
    sexoButton: {
        flex: 1, // Divide o espaço
        height: 50,
        backgroundColor: '#fff',
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 4, // Espaçamento entre botões
    },
    sexoButtonActive: {
        backgroundColor: '#007bff',
        borderColor: '#007bff',
    },
    sexoButtonText: {
        fontSize: 14,
        color: '#333',
    },
    sexoButtonTextActive: {
        color: '#fff',
        fontWeight: 'bold',
    },
    // --- Fim dos Estilos de Sexo ---
    button: { width: '100%', height: 50, backgroundColor: '#007bff', justifyContent: 'center', alignItems: 'center', borderRadius: 8, marginTop: 20 },
    buttonDisabled: { backgroundColor: '#99caff' },
    buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
    linkButton: { marginTop: 15 },
    linkText: { color: '#007bff', fontSize: 14 }
});