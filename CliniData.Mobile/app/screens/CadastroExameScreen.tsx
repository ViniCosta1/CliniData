import * as DocumentPicker from 'expo-document-picker';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';


export default function CadastroExameScreen() {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [data, setData] = useState('');
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFilePick = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: '*/*',
      copyToCacheDirectory: true,
      multiple: false,
    });
    if (result.assets && result.assets.length > 0) {
      setFileName(result.assets[0].name);
      // Você pode salvar o arquivo ou enviar para o backend aqui
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <View style={styles.field}>
          <Text style={styles.label}>Título</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite o título do exame"
            value={titulo}
            onChangeText={setTitulo}
          />
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Descrição</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite uma descrição"
            value={descricao}
            onChangeText={setDescricao}
          />
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Data</Text>
          <TextInput
            style={styles.input}
            placeholder="Informe a data do exame"
            value={data}
            onChangeText={setData}
          />
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Arquivo do exame</Text>
          <TouchableOpacity style={styles.uploadButton} onPress={handleFilePick}>
            <Text style={styles.uploadButtonText}>
              {fileName ? `Selecionado: ${fileName}` : 'Selecionar arquivo'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.footer}>
        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Salvar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 32,
    paddingBottom: 100, // espaço reservado para a navbar (evita corte do botão Salvar)
    justifyContent: 'flex-start',
  },
  form: {
    marginTop: 0,
    marginBottom: 0,
    width: '100%',
  },
  field: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    marginLeft: 2,
  },
  input: {
    fontSize: 16,
    padding: 12,
    backgroundColor: '#fafafa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d0d0d0',
  },
  uploadButton: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#2ea7ff',
    alignSelf: 'flex-start',
  },
  uploadButtonText: {
    color: '#2ea7ff',
    fontWeight: '500',
    fontSize: 15,
  },
  footer: {
    alignItems: 'center',
    marginTop: 24,
  },
  saveButton: {
    backgroundColor: '#2ea7ff',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 0,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
