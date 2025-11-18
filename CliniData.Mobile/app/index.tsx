import React, { useState } from 'react';
import { 
    View, Text, TextInput, TouchableOpacity, 
    StyleSheet, Image, SafeAreaView, Alert
} from 'react-native';
import { Link, router } from 'expo-router';

// 👉 Caminho correto
import api from './services/api';

const logo = require('../assets/images/logoreal.png');

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async () => {
        if (isLoading) return;
        setIsLoading(true);

        if (!email.includes('@')) {
            Alert.alert('Erro', 'Por favor, insira um e-mail válido.');
            setIsLoading(false);
            return;
        }

        try {
            // 👉 ROTA exata da sua API
            const response = await api.post('/Auth/login', {
                email: email,
                password: senha
            });

            console.log("Resposta da API:", response.data);

            // 👉 Captura token em qualquer formato possível
            const token =
                response.data?.token ??
                response.data?.Token ??
                response.data?.access_token;

            if (token) {
                console.log('Token recebido:', token);

                // 👉 Redireciona para a home
                router.replace('/(tabs)/home');

            } else {
                Alert.alert('Erro', 'Nenhum token foi recebido da API.');
            }

        } catch (error: any) {
            console.error('Erro na chamada da API:', error);

            let mensagemErro = 'Não foi possível fazer o login.';

            if (error.response) {
                console.log('Status da API:', error.response.status);
                console.log('Data da API:', error.response.data);

                if (error.response.status === 401)
                    mensagemErro = 'E-mail ou senha inválidos.';

                if (error.response.status === 400)
                    mensagemErro = 'Requisição inválida. Verifique Email e Password.';
            } 
            else if (error.request) {
                mensagemErro = 'Não foi possível conectar ao servidor. Verifique sua rede.';
            }

            Alert.alert('Erro', mensagemErro);

        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.formContainer}>
                
                <Image source={logo} style={styles.logo} />
                <Text style={styles.title}>Login</Text>

                <TextInput
                    style={styles.input}
                    placeholder="E-mail"
                    placeholderTextColor="#aaa"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    editable={!isLoading}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Senha"
                    placeholderTextColor="#aaa"
                    value={senha}
                    onChangeText={setSenha}
                    secureTextEntry
                    editable={!isLoading}
                />

                <TouchableOpacity
                    style={[styles.button, isLoading && styles.buttonDisabled]}
                    onPress={handleLogin}
                    disabled={isLoading}
                >
                    <Text style={styles.buttonText}>
                        {isLoading ? 'Entrando...' : 'Entrar'}
                    </Text>
                </TouchableOpacity>

                <Link href="/register" asChild>
                    <TouchableOpacity style={styles.linkButton} disabled={isLoading}>
                        <Text style={styles.linkText}>
                            Não possui uma conta? Cadastre-se
                        </Text>
                    </TouchableOpacity>
                </Link>

                <Link href="/password-recovery" asChild>
                    <TouchableOpacity style={styles.linkButton} disabled={isLoading}>
                        <Text style={styles.linkText}>Esqueci a senha</Text>
                    </TouchableOpacity>
                </Link>

            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f7f7f7', justifyContent: 'center', alignItems: 'center' },
    formContainer: { width: '90%', padding: 20, backgroundColor: '#fff', borderRadius: 10, alignItems: 'center', shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.23, shadowRadius: 2.62, elevation: 4 },
    logo: { width: 70, height: 70, resizeMode: 'contain', marginBottom: 20 },
    title: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 20 },
    input: { width: '100%', height: 50, backgroundColor: '#fff', borderColor: '#ddd', borderWidth: 1, borderRadius: 8, paddingHorizontal: 15, marginBottom: 15, fontSize: 16 },
    button: { width: '100%', height: 50, backgroundColor: '#007bff', justifyContent: 'center', alignItems: 'center', borderRadius: 8, marginTop: 10 },
    buttonDisabled: { backgroundColor: '#99caff' },
    buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
    linkButton: { marginTop: 15 },
    linkText: { color: '#007bff', fontSize: 14 }
});
