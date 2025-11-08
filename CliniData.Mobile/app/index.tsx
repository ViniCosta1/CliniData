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

const logo = require('../assets/images/logoreal.png');

export default function LoginScreen() {
    const [emailCpf, setEmailCpf] = useState('');
    const [senha, setSenha] = useState('');

    function handleLogin() {
    
        router.replace('/(tabs)/home'); 
    }


    const formatCPF = (text: string) => {
        const cleaned = text.replace(/\D/g, '');
        const limited = cleaned.slice(0, 11);
        let masked = limited.replace(/(\d{3})(\d)/, '$1.$2');
        masked = masked.replace(/(\d{3})(\d)/, '$1.$2');
        masked = masked.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        return masked;
    };

    
    const handleLoginChange = (text: string) => {
      
        const isEmail = /[a-zA-Z@]/.test(text);

        if (isEmail) {
           
            setEmailCpf(text);
        } else {
          
            const formattedCpf = formatCPF(text);
            setEmailCpf(formattedCpf);
        }
    };
    

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.formContainer}>
                
                <Image source={logo} style={styles.logo} />
                
                <Text style={styles.title}>Login</Text>

                <TextInput
                    style={styles.input}
                    placeholder="C.P.F OU E-mail"
                    value={emailCpf}
                    onChangeText={handleLoginChange} 
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Senha"
                    value={senha}
                    onChangeText={setSenha}
                    secureTextEntry
                />

                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                    <Text style={styles.buttonText}>Entrar</Text>
                </TouchableOpacity>

                <Link href="/register" asChild>
                    <TouchableOpacity style={styles.linkButton}>
                        <Text style={styles.linkText}>Não possui uma conta? Cadastre-se</Text> 
                    </TouchableOpacity>
                </Link>

                <Link href="/password-recovery" asChild> 
                    <TouchableOpacity style={styles.linkButton}>
                        <Text style={styles.linkText}>Esqueci a senha</Text>
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