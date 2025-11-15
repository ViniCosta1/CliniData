import React from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    SafeAreaView, 
    TouchableOpacity,
    Alert 
} from 'react-native';

import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// --- Dados Fictícios 

const examesFicticios = [
    {
        id: '1',
        titulo: 'Hemograma Completo',
        status: 'Disponível',
        data: '10/11/2025',
        laboratorio: 'Laboratório Central',
        icon: 'document-text-outline',
        resultado: 'Todos os valores estão dentro da normalidade. Nenhum indicador preocupante detectado.'
    },
    {
        id: '2',
        titulo: 'Raio-X Torácico',
        status: 'Agendado',
        data: '18/11/2025',
        laboratorio: 'Clínica Radiológica',
        icon: 'calendar-outline',
        local: 'Rua das Flores, 123, Sala 405'
    },
    {
        id: '3',
        titulo: 'Ultrassom Abdominal',
        status: 'Disponível',
        data: '05/10/2025',
        laboratorio: 'Hospital São Lucas',
        icon: 'document-text-outline',
        resultado: 'Fígado e rins sem alterações aparentes. Vesícula biliar normal.'
    },
];
// --- Fim dos Dados Fictícios ---


export default function ExameDetailsScreen() {
 
    const { id } = useLocalSearchParams();

    const exame = examesFicticios.find(item => item.id === id);

    if (!exame) {
        return (
            <SafeAreaView style={styles.container}>
                <Text style={styles.headerTitle}>Erro</Text>
                <Text style={styles.errorText}>Exame não encontrado.</Text>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={20} color="#fff" />
                    <Text style={styles.backButtonText}>Voltar para Exames</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    const handleAction = () => {
        if (exame.status === 'Disponível') {
            Alert.alert("Download", "A função de baixar o PDF do resultado ainda está em construção.");
        } else {
            Alert.alert("Localização", `O exame será em: ${exame.local}`);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Botão de Voltar */}

           <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                <Ionicons name="arrow-back-outline" size={24} color="#007bff" />
                <Text style={styles.backButtonText}>Voltar</Text> 
            </TouchableOpacity>

            {/* Cabeçalho */}
            <View style={styles.header}>
                <Ionicons 
                    name={exame.icon as any} 
                    size={40} 
                    color={exame.status === 'Disponível' ? '#28a745' : '#007bff'} 
                />
                <Text style={styles.headerTitle}>{exame.titulo}</Text>
                <Text style={styles.headerSubtitle}>{exame.laboratorio}</Text>
            </View>

            {/* Corpo com Detalhes */}
            <View style={styles.detailsContainer}>
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Status</Text>
                    <Text 
                        style={[
                            styles.detailValue, 
                            { color: exame.status === 'Disponível' ? '#28a745' : '#007bff', fontWeight: 'bold' }
                        ]}
                    >
                        {exame.status}
                    </Text>
                </View>

                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>{exame.status === 'Disponível' ? 'Data do Resultado' : 'Data Agendada'}</Text>
                    <Text style={styles.detailValue}>{exame.data}</Text>
                </View>
                
                {/* Mostra o resultado ou o local, dependendo do status */}
                {exame.status === 'Disponível' ? (
                    <View style={styles.resultBox}>
                        <Text style={styles.detailLabel}>Resultado (Resumo)</Text>
                        <Text style={styles.resultText}>{exame.resultado}</Text>
                    </View>
                ) : (
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Local</Text>
                        <Text style={styles.detailValue}>{exame.local}</Text>
                    </View>
                )}
            </View>

            {/* Botão de Ação Principal */}
            <TouchableOpacity style={styles.actionButton} onPress={handleAction}>
                <Ionicons 
                    name={exame.status === 'Disponível' ? 'download-outline' : 'map-outline'} 
                    size={20} 
                    color="#fff" 
                />
                <Text style={styles.actionButtonText}>
                    {exame.status === 'Disponível' ? 'Baixar Resultado (PDF)' : 'Ver Localização'}
                </Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

// 6. Estilos
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f2f5',
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    backButtonText: {
        color: '#007bff',
        fontSize: 16,
        marginLeft: 8,
    },
    header: {
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 20,
        paddingHorizontal: 20,
    },
    headerTitle: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginTop: 10,
    },
    headerSubtitle: {
        fontSize: 18,
        color: '#666',
        marginTop: 5,
    },
    detailsContainer: {
        backgroundColor: '#fff',
        marginHorizontal: 20,
        borderRadius: 10,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    detailLabel: {
        fontSize: 16,
        color: '#555',
    },
    detailValue: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
        maxWidth: '60%', 
        textAlign: 'right',
    },
    resultBox: {
        paddingVertical: 15,
    },
    resultText: {
        fontSize: 15,
        color: '#333',
        marginTop: 8,
        lineHeight: 22,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#007bff',
        paddingVertical: 15,
        borderRadius: 10,
        margin: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 4,
    },
    actionButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    errorText: {
        textAlign: 'center',
        fontSize: 18,
        color: '#666',
        marginTop: 20,
    }
});