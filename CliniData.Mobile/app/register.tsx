import React, { useState } from 'react'; 
import { 
    View, 
    Text, 
    TextInput, 
    TouchableOpacity, 
    StyleSheet, 
    Image,
    SafeAreaView,
    Alert 
} from 'react-native';

import { Link, router } from 'expo-router'; 
import api from './services/api'; 

export default function RegisterScreen() {
    const [cpf, setCpf] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [repetirSenha, setRepetirSenha] = useState('');
    const [isLoading, setIsLoading] = useState(false); 
    const logo = require('../assets/images/logoreal.png'); 


    const formatCPF = (text: string) => {
        const cleaned = text.replace(/\D/g, '');
        const limited = cleaned.slice(0, 11);
        let masked = limited.replace(/(\d{3})(\d)/, '$1.$2');
        masked = masked.replace(/(\d{3})(\d)/, '$1.$2');
        masked = masked.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        return masked;
    };

    const handleCpfChange = (text: string) => {
        const formattedCpf = formatCPF(text);
        setCpf(formattedCpf);
    };


    const handleRegister = async () => {
        if (isLoading) return;

        if (cpf.length < 14) {
            Alert.alert('Erro no Cadastro', 'Por favor, preencha o CPF completo.');
            return;
        }
        if (!email.includes('@') || !email.includes('.')) {
            Alert.alert('Erro no Cadastro', 'Por favor, insira um e-mail válido.');
            return;
        }
        if (senha.length < 6) {
            Alert.alert('Erro no Cadastro', 'A senha deve ter pelo menos 6 caracteres.');
            return;
        }
        if (senha !== repetirSenha) {
            Alert.alert('Erro no Cadastro', 'As senhas não coincidem.');
            return;
        }
        
        setIsLoading(true);

        const cpfLimpo = cpf.replace(/\D/g, '');

        try {
            const response = await api.post('/Register', { 
                cpf: cpfLimpo, 
                email: email, 
                senha: senha,
            });

            Alert.alert(
                'Sucesso!', 
                'Usuário cadastrado com sucesso. Você será enviado para a tela de Login.',
                [
                    { text: 'OK', onPress: () => router.replace('/') } 
                ]
            );

        } catch (error: any) {
            console.error('Erro na chamada da API de Registro:', error);
            
            let mensagemErro = 'Não foi possível fazer o cadastro.';
            if (error.response && error.response.data) {
                mensagemErro = error.response.data.message || 'Erro ao cadastrar. Tente novamente.';
            } else if (error.response && error.response.status === 400) {
                 mensagemErro = 'Dados inválidos ou e-mail/CPF já cadastrado.';
            } else if (error.request) {
                mensagemErro = 'Não foi possível conectar ao servidor. Verifique sua rede.';
            }

            Alert.alert('Erro no Cadastro', mensagemErro);
        } finally {
            setIsLoading(false); 
        }
    };
    
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.formContainer}>
                
                <Image source={logo} style={styles.logo} />
                
                <Text style={styles.title}>Cadastro</Text>
                
                <TextInput
                    style={styles.input}
                    placeholder="C.P.F"
                    value={cpf}
                    onChangeText={handleCpfChange} 
                    keyboardType="numeric"
                    maxLength={14} 
                    editable={!isLoading} 
                />
                <TextInput
                    style={styles.input}
                    placeholder="E-mail"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    editable={!isLoading}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Senha"
                    value={senha}
                    onChangeText={setSenha}
                    secureTextEntry 
                    editable={!isLoading}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Repita a senha"
                    value={repetirSenha}
                    onChangeText={setRepetirSenha}
                    secureTextEntry 
                    editable={!isLoading}
                />

                <TouchableOpacity 
                    style={[styles.button, isLoading && styles.buttonDisabled]}
                    onPress={handleRegister}
                    disabled={isLoading}
                >
                    <Text style={styles.buttonText}>
                        {isLoading ? 'Cadastrando...' : 'Cadastrar'}
                    </Text> 
                </TouchableOpacity>

                <Link href="/" asChild> 
                    <TouchableOpacity style={styles.linkButton} disabled={isLoading}>
                        <Text style={styles.linkText}>Já possui uma conta? Faça login</Text>
                    </TouchableOpacity>
                </Link>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f7f7f7', 
        justifyContent: 'center',
        alignItems: 'center',
    },
    formContainer: {
        width: '90%',
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
    },
    logo: {
        width: 70,
        height: 70,
        resizeMode: 'contain',
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        height: 50,
        backgroundColor: '#fff',
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 15,
        fontSize: 16,
    },
    button: {
        width: '100%',
        height: 50,
        backgroundColor: '#007bff', 
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        marginTop: 10,
    },
    buttonDisabled: {
        backgroundColor: '#99caff', 
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    linkButton: {
        marginTop: 15,
    },
    linkText: {
        color: '#007bff',
        fontSize: 14,
    }
});