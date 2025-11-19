// Cole isso dentro de: app/(tabs)/home.tsx
// (O nosso Dashboard Aprimorado)

import React from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    SafeAreaView, 
    TouchableOpacity,
    Alert 
} from 'react-native';
import { router } from 'expo-router'; // Para navegação
import { Ionicons } from '@expo/vector-icons'; // Para os ícones

export default function HomeScreen() {
    const userName = "Paciente"; 

    const handleAgendar = () => {
        // Agora podemos habilitar isso!
        router.push('/agendamento'); 
        // Alert.alert("Em Breve", "A tela de agendamento ainda está em construção.");
    };

    const handleMeusExames = () => {
        router.push('/tabs/exames'); 
    };

    const handleLogout = () => {
        Alert.alert(
            "Sair", 
            "Você tem certeza que deseja sair?",
            [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Sair', onPress: () => router.replace('/') } 
            ]
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* 1. Saudação */}
            <View style={styles.header}>
                <Text style={styles.greetingText}>Olá, {userName}!</Text>
                <Text style={styles.welcomeText}>Bem-vindo ao CliniData.</Text>
            </View>

            {/* 2. Card de Próximo Agendamento */}
            <View style={styles.infoCard}>
                <Ionicons name="calendar-outline" size={24} color="#007bff" />
                <View style={styles.infoCardContent}>
                    <Text style={styles.infoCardTitle}>Próximo Agendamento</Text>
                    <Text style={styles.infoCardText}>Consulta com Dr. João - 15/11/2025 às 10:00</Text>
                    <TouchableOpacity style={styles.viewDetailsButton}>
                        <Text style={styles.viewDetailsButtonText}>Ver detalhes</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* 3. Botões de Ação Rápida */}
            <View style={styles.actionButtonsContainer}>
                <TouchableOpacity style={styles.actionButton} onPress={handleAgendar}>
                    <Ionicons name="clipboard-outline" size={30} color="#007bff" />
                    <Text style={styles.actionButtonText}>Agendar Consulta</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionButton} onPress={handleMeusExames}>
                    <Ionicons name="folder-open-outline" size={30} color="#007bff" />
                    <Text style={styles.actionButtonText}>Meus Exames</Text>
                </TouchableOpacity>
            </View>
            
            {/* 4. Ação de Sair */}
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Ionicons name="log-out-outline" size={22} color="#d9534f" />
                <Text style={styles.logoutButtonText}>Sair</Text>
            </TouchableOpacity>

        </SafeAreaView>
    );
}

// Estilos para o novo Dashboard
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f2f5', 
        alignItems: 'center',
        paddingTop: 20, 
    },
    header: {
        width: '90%',
        marginBottom: 20,
        alignItems: 'flex-start',
    },
    greetingText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
    },
    welcomeText: {
        fontSize: 16,
        color: '#666',
        marginTop: 5,
    },
    infoCard: {
        width: '90%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
        marginBottom: 20,
    },
    infoCardContent: {
        marginLeft: 15,
        flex: 1,
    },
    infoCardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    infoCardText: {
        fontSize: 14,
        color: '#666',
    },
    viewDetailsButton: {
        marginTop: 10,
        alignSelf: 'flex-start',
    },
    viewDetailsButtonText: {
        color: '#007bff',
        fontWeight: 'bold',
        fontSize: 14,
    },
    actionButtonsContainer: {
        width: '90%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 30,
    },
    actionButton: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        alignItems: 'center',
        justifyContent: 'center',
        width: '48%', 
        height: 120, 
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    actionButtonText: {
        marginTop: 10,
        fontSize: 15,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
    },
    logoutButton: {
        position: 'absolute',
        bottom: 40,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        borderColor: '#d9534f',
        borderWidth: 1,
    },
    logoutButtonText: {
        color: '#d9534f',
        marginLeft: 8,
        fontWeight: 'bold',
    }
});