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

import { Link } from 'expo-router'; 


const logo = require('../assets/images/logoreal.png');

export default function PasswordRecoveryScreen() {
    const [codigo, setCodigo] = useState('');

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.formContainer}>
                {/* 1. Logo */}
                <Image source={logo} style={styles.logo} />

                {/* 2. Título */}
                <Text style={styles.title}>Recuperação De Senha</Text>
                <Text style={styles.subtitle}>Digite o código enviado no E-Mail para recuperar a senha</Text>


                {/* 3. Inputs */}
                <TextInput
                    style={styles.input}
                    placeholder="Digite o Código"
                    value={codigo}
                    onChangeText={setCodigo}
                    keyboardType="numeric"
                />

                {/* 4. Botões */}
                <TouchableOpacity style={styles.button} onPress={() => { /* Lógica de reenviar código */ }}>
                    <Text style={styles.buttonText}>Reenviar código</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={() => { /* Lógica de entrar */ }}>
                    <Text style={styles.buttonText}>Entrar</Text>
                </TouchableOpacity>

                {/* 5. Link de Navegação para voltar ao Login */}
                <Link href="/" asChild> 
                    <TouchableOpacity style={styles.linkButton}>
                        <Text style={styles.linkText}>Lembra da senha? Faça login</Text>
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
        marginBottom: 10,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginBottom: 20,
        paddingHorizontal: 10,
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