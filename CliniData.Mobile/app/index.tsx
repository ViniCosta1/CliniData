import React, { useState } from 'react';
import { 
    View, 
    Text, 
    TextInput, 
    TouchableOpacity, 
    StyleSheet, 
    Image,
    SafeAreaView 
} from 'react-native';

import { Link, router } from 'expo-router'; 


const logo = require('../assets/images/logo.png'); // LOGO

export default function LoginScreen() {
    const [emailCpf, setEmailCpf] = useState('');
    const [senha, setSenha] = useState('');

    function handleLogin() {
        
        router.replace('/(tabs)/home'); 
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.formContainer}>

                {/* 1. Logo */}
                 <Image source={logo} style={styles.logo} />
                {/* <Text style={styles.logoPlaceholder}>[Logo]</Text> */}

                {/* 2. Título */}
                <Text style={styles.title}>Login</Text>

                {/* 3. Inputs */}
                <TextInput
                    style={styles.input}
                    placeholder="C.P.F OU E-mail"
                    value={emailCpf}
                    onChangeText={setEmailCpf}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Senha"
                    value={senha}
                    onChangeText={setSenha}
                    secureTextEntry // Para esconder a senha
                />

                {/* 4. Botão de Entrar */}
                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                    <Text style={styles.buttonText}>Entrar</Text>
                </TouchableOpacity>

                {/* 5. Links de Navegação */}
                
                {/* Este Link usa o Expo Router para ir para a tela app/register.tsx */}
                <Link href="/register" asChild>
                    <TouchableOpacity style={styles.linkButton}>
                        {/* O texto da sua imagem estava "Faça login", ajustei para "Cadastre-se" */}
                        <Text style={styles.linkText}>Não possui uma conta? Cadastre-se</Text> 
                    </TouchableOpacity>
                </Link>

                {/* Este Link irá para app/password-recovery.tsx (quando criarmos) */}
                <Link href="/password-recovery" asChild> 
                    <TouchableOpacity style={styles.linkButton}>
                        <Text style={styles.linkText}>Esqueci a senha</Text>
                    </TouchableOpacity>
                </Link>
            </View>
        </SafeAreaView>
    );
}

// Estilos para parecer com a sua imagem
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
    logoPlaceholder: {
        width: 70,
        height: 70,
        textAlign: 'center',
        textAlignVertical: 'center',
        backgroundColor: '#eee',
        color: '#aaa',
        borderRadius: 35,
        marginBottom: 20,
        fontSize: 16,
        fontWeight: 'bold',
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
        backgroundColor: '#007bff', // Azul
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