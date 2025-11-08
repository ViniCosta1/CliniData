import React, { useState } from 'react';
import { 
    View, 
    Text, 
    TextInput, 
    TouchableOpacity, 
    StyleSheet, 
    Image,
    SafeAreaView,
    Alert // <-- 1. IMPORTE O ALERTA
} from 'react-native';

import { Link } from 'expo-router'; 

export default function RegisterScreen() {
    const [cpf, setCpf] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [repetirSenha, setRepetirSenha] = useState('');
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

    // --- 2. NOVA FUNÇÃO DE REGISTRO ---
    const handleRegister = () => {
        // Validação 1: CPF
        if (cpf.length < 14) { // "000.000.000-00" tem 14 caracteres
            Alert.alert('Erro no Cadastro', 'Por favor, preencha o CPF completo.');
            return; // Para a função
        }

        // Validação 2: E-mail
        if (!email.includes('@') || !email.includes('.')) {
            Alert.alert('Erro no Cadastro', 'Por favor, insira um e-mail válido.');
            return;
        }

        // Validação 3: Senha curta
        if (senha.length < 6) {
            Alert.alert('Erro no Cadastro', 'A senha deve ter pelo menos 6 caracteres.');
            return;
        }

        // Validação 4: Senhas diferentes
        if (senha !== repetirSenha) {
            Alert.alert('Erro no Cadastro', 'As senhas não coincidem.');
            return;
        }

        // Se tudo estiver certo:
        Alert.alert('Sucesso!', 'Validação concluída. Pronto para enviar à API!');
        console.log('Dados prontos para enviar:', { cpf, email, senha });

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
                />
                <TextInput
                    style={styles.input}
                    placeholder="E-mail"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Senha"
                    value={senha}
                    onChangeText={setSenha}
                    secureTextEntry 
                />
                <TextInput
                    style={styles.input}
                    placeholder="Repita a senha"
                    value={repetirSenha}
                    onChangeText={setRepetirSenha}
                    secureTextEntry 
                />

                {/* 3. BOTÃO AGORA CHAMA A FUNÇÃO */}
                <TouchableOpacity style={styles.button} onPress={handleRegister}>
                    {/* (Mudei o texto de "Entrar" para "Cadastrar") */}
                    <Text style={styles.buttonText}>Cadastrar</Text> 
                </TouchableOpacity>

                <Link href="/" asChild> 
                    <TouchableOpacity style={styles.linkButton}>
                        <Text style={styles.linkText}>Já possui uma conta? Faça login</Text>
                    </TouchableOpacity>
                </Link>
            </View>
        </SafeAreaView>
    );
}

// Estilos 
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