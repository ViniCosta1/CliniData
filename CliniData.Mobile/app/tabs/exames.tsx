import React from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    SafeAreaView, 
    TouchableOpacity,
    FlatList, 
    Alert 
} from 'react-native';
import { router } from 'expo-router'; // Para navegação
import { Ionicons } from '@expo/vector-icons'; // Para os ícones

// 1. Dados Fictícios
const examesFicticios = [
    {
        id: '1',
        titulo: 'Hemograma Completo',
        status: 'Disponível', // Status é importante para o paciente
        data: 'Resultado de 10/11/2025',
        laboratorio: 'Laboratório Central',
        icon: 'document-text-outline' // Ícone para "resultado"
    },
    {
        id: '2',
        titulo: 'Raio-X Torácico',
        status: 'Agendado',
        data: 'Agendado para 18/11/2025',
        laboratorio: 'Clínica Radiológica',
        icon: 'calendar-outline' // Ícone para "agendado"
    },
    {
        id: '3',
        titulo: 'Ultrassom Abdominal',
        status: 'Disponível',
        data: 'Resultado de 05/10/2025',
        laboratorio: 'Hospital São Lucas',
        icon: 'document-text-outline'
    },
];

// 2. Componente para renderizar cada item da lista
const ExameCard = ({ item }: { item: typeof examesFicticios[0] }) => {
    
    // Define a cor do status (Verde para disponível, Azul para agendado)
    const statusColor = item.status === 'Disponível' ? '#28a745' : '#007bff';

    const handlePress = () => {
        // Leva para a tela de detalhes do exame
        router.push(`/exames/${item.id}`);
    };

    return (
        <TouchableOpacity style={styles.card} onPress={handlePress}>
            <Ionicons name={item.icon as any} size={24} color={statusColor} style={styles.cardIcon} />
            <View style={styles.cardTextContainer}>
                <Text style={styles.cardTitle}>{item.titulo}</Text>
                <Text style={styles.cardSubtitle}>{item.laboratorio}</Text>
                <Text style={styles.cardDate}>{item.data}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
                <Text style={styles.statusText}>{item.status}</Text>
            </View>
        </TouchableOpacity>
    );
};

// 3. A Tela Principal
export default function ExamesScreen() {

    const handleAgendar = () => {
        // TODO: Navegar para a tela de agendamento
        Alert.alert("Em Breve", "A tela de agendamento ainda está em construção.");
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.headerTitle}>Meus Exames</Text>

            {/* Botão para Agendar Novo Exame */}
            <TouchableOpacity style={styles.addButton} onPress={handleAgendar}>
                <Ionicons name="add" size={20} color="#fff" />
                <Text style={styles.addButtonText}>Agendar Novo Exame</Text>
            </TouchableOpacity>

            {/* A Lista de Exames */}
            <FlatList
                data={examesFicticios}
                renderItem={({ item }) => <ExameCard item={item} />}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
    );
}

// 4. Estilos
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f2f5', // Mesma cor de fundo da Home
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 20,
        marginBottom: 10,
        paddingHorizontal: 20,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#007bff',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 10,
        marginHorizontal: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 4,
    },
    addButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 8,
    },
    listContainer: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    cardIcon: {
        marginRight: 15,
    },
    cardTextContainer: {
        flex: 1, // Ocupa o espaço disponível
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 3,
    },
    cardSubtitle: {
        fontSize: 14,
        color: '#555',
        marginBottom: 3,
    },
    cardDate: {
        fontSize: 13,
        color: '#777',
    },
    statusBadge: {
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 12,
        marginLeft: 10,
    },
    statusText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
});