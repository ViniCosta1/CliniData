import React, { useState } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    SafeAreaView, 
    TouchableOpacity,
    TextInput,
    Alert,
    Platform 
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

import * as DocumentPicker from 'expo-document-picker';

export default function AgendamentoScreen() {
    const [titulo, setTitulo] = useState('');
    const [observacoes, setObservacoes] = useState('');
    
    // --- Lógica do Seletor de Data ---
    const [data, setData] = useState(new Date()); 
    const [showDatePicker, setShowDatePicker] = useState(false);

    const onDateChange = (event: any, selectedDate?: Date) => {
        const currentDate = selectedDate || data;
        setShowDatePicker(Platform.OS === 'ios'); 
        setData(currentDate);
    };

    const showDatepicker = () => {
        setShowDatePicker(true);
    };

    // --- Lógica do Seletor de Arquivos
 
    const [arquivo, setArquivo] = useState<DocumentPicker.DocumentPickerAsset | null>(null);

    const pickDocument = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: '*/*', 
                copyToCacheDirectory: true,
            });

            if (result.canceled === false && result.assets && result.assets.length > 0) {
                const firstAsset = result.assets[0];
                setArquivo(firstAsset); // Guarda o primeiro arquivo
                console.log('Arquivo selecionado:', firstAsset.name);
            } else {
                console.log('Seleção de arquivo cancelada');
                setArquivo(null); // Limpa o arquivo se cancelar
            }
        } catch (err) {
            console.error('Erro ao selecionar arquivo:', err);
        }
    };

    // --- Lógica de Salvar ---
    const handleSave = () => {
        if (!titulo || !data) {
            Alert.alert("Erro", "Por favor, preencha pelo menos o tipo de exame e a data.");
            return;
        }
        
        // TODO: Enviar os dados
        
        Alert.alert(
            "Sucesso", 
            "Seu agendamento foi solicitado! Você será redirecionado para a Home.",
            [
                { text: 'OK', onPress: () => router.push('/tabs/home') }
            ]
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                <Ionicons name="arrow-back-outline" size={24} color="#007bff" />
                <Text style={styles.backButtonText}>Voltar</Text> 
            </TouchableOpacity>
            
            <Text style={styles.headerTitle}>Agendar Exame</Text>
            <Text style={styles.headerSubtitle}>Preencha os dados abaixo para solicitar seu agendamento.</Text>

            <View style={styles.formContainer}>
               
                <Text style={styles.label}>Tipo de Exame ou Consulta</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Ex: Hemograma Completo, Consulta Ortopédica"
                    value={titulo}
                    onChangeText={setTitulo}
                />
                
                <Text style={styles.label}>Observações (Opcional)</Text>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Ex: Sinto dores no joelho ao acordar."
                    value={observacoes}
                    onChangeText={setObservacoes}
                    multiline={true}
                    numberOfLines={4}
                />
        
                <Text style={styles.label}>Data Desejada</Text>
                <TouchableOpacity style={styles.datePickerButton} onPress={showDatepicker}>
                    <Ionicons name="calendar-outline" size={20} color="#555" />
                    <Text style={styles.datePickerText}>
                        {data.toLocaleDateString('pt-BR')} 
                    </Text>
                </TouchableOpacity>

                {showDatePicker && (
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={data}
                        mode={'date'}
                        is24Hour={true}
                        display="default"
                        onChange={onDateChange}
                    />
                )}

                <Text style={styles.label}>Anexar Pedido Médico (Opcional)</Text>
                <TouchableOpacity style={styles.uploadButton} onPress={pickDocument}>
                    <Ionicons name="cloud-upload-outline" size={20} color="#007bff" />
                    <Text style={styles.uploadButtonText}>
                        {/* 4. Pega o 'name' do 'arquivo' */}
                        {arquivo ? arquivo.name : 'Selecionar arquivo (PDF, JPG...)'}
                    </Text>
                </TouchableOpacity>

                {/* Botão "Salvar" */}
                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                    <Text style={styles.saveButtonText}>Salvar Agendamento</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

// Estilos
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
    headerTitle: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 10,
        paddingHorizontal: 20,
    },
    headerSubtitle: {
        fontSize: 16,
        color: '#666',
        marginTop: 5,
        paddingHorizontal: 20,
        marginBottom: 10,
    },
    formContainer: {
        backgroundColor: '#fff',
        margin: 20,
        borderRadius: 10,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
        marginTop: 10,
    },
    input: {
        width: '100%',
        height: 50,
        backgroundColor: '#f9f9f9',
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 15,
        fontSize: 16,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top', 
        paddingTop: 15,
    },
    datePickerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 8,
        padding: 15,
    },
    datePickerText: {
        fontSize: 16,
        marginLeft: 10,
        color: '#333',
    },
    uploadButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#e6f2ff', 
        borderColor: '#007bff',
        borderWidth: 1,
        borderStyle: 'dashed',
        borderRadius: 8,
        padding: 15,
        justifyContent: 'center',
    },
    uploadButtonText: {
        fontSize: 14,
        marginLeft: 10,
        color: '#007bff',
        fontWeight: 'bold',
    },
    saveButton: {
        backgroundColor: '#007bff',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 25,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});