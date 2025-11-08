import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions, useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const LogoutScreen: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();

    const handleSignOut = () => {
        Alert.alert(
            'Confirmar saída',
            'Tem certeza que deseja sair?',
            [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Sair', style: 'destructive', onPress: performSignOut }
            ]
        );
    };

    const performSignOut = async () => {
        setLoading(true);
        try {
            // Limpa dados locais (ajuste chaves conforme sua app)
            await AsyncStorage.clear();

            // TODO: se necessário, chame sua API de logout aqui
            // await api.post('/logout');

            // Redireciona para a tela de login, substituindo o histórico de navegação
            navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [{ name: 'Login' }],
                })
            );
        } catch (error) {
            console.error('Logout error', error);
            Alert.alert('Erro', 'Não foi possível encerrar a sessão. Tente novamente.');
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sair</Text>
            <Text style={styles.subtitle}>Clique no botão abaixo para encerrar sua sessão.</Text>

            <TouchableOpacity style={styles.button} onPress={handleSignOut} disabled={loading}>
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Sair</Text>}
            </TouchableOpacity>
        </View>
    );
};

export default LogoutScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 28,
        fontWeight: '600',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 24,
    },
    button: {
        backgroundColor: '#d32f2f',
        paddingHorizontal: 32,
        paddingVertical: 12,
        borderRadius: 8,
    },
    buttonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
});