import * as DocumentPicker from "expo-document-picker";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import api from "../services/api"; // seu axios configurado
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function CadastroExameScreen() {
  const [tipoExame, setTipoExame] = useState("");
  const [instituicao, setInstituicao] = useState("");
  const [resultado, setResultado] = useState("");
  const [observacao, setObservacao] = useState("");
  const [data, setData] = useState("");
  const [file, setFile] = useState<any>(null);

  const handleFilePick = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "*/*",
      copyToCacheDirectory: true,
    });

    if (!result.canceled && result.assets?.length > 0) {
      setFile(result.assets[0]);
    }
  };

  const salvarExame = async () => {
    if (!tipoExame || !data) {
      Alert.alert("Erro", "Preencha todos os campos obrigatórios.");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("token");

      const formData = new FormData();

      formData.append("TipoExame", tipoExame);
      formData.append("DataHora", new Date(data).toISOString());
      formData.append("Instituicao", instituicao);
      formData.append("Resultado", resultado);
      formData.append("Observacao", observacao);

      if (file) {
        formData.append("DocumentoExame", {
          uri: file.uri,
          name: file.name,
          type: file.mimeType || "application/octet-stream",
        } as any);
      }

      const response = await api.post("/api/exame", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      Alert.alert("Sucesso", "Exame cadastrado!");
    } catch (error: any) {
      console.log("Erro ao salvar exame:", error.response?.data || error);
      Alert.alert("Erro", "Não foi possível salvar o exame.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        
        <View style={styles.field}>
          <Text style={styles.label}>Tipo do Exame</Text>
          <TextInput
            style={styles.input}
            value={tipoExame}
            onChangeText={setTipoExame}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Data</Text>
          <TextInput
            style={styles.input}
            value={data}
            placeholder="2025-11-23"
            onChangeText={setData}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Instituição</Text>
          <TextInput
            style={styles.input}
            value={instituicao}
            onChangeText={setInstituicao}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Resultado</Text>
          <TextInput
            style={styles.input}
            value={resultado}
            onChangeText={setResultado}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Observação</Text>
          <TextInput
            style={styles.input}
            value={observacao}
            onChangeText={setObservacao}
          />
        </View>

        <View style={styles.field}>
          <TouchableOpacity style={styles.uploadButton} onPress={handleFilePick}>
            <Text style={styles.uploadButtonText}>
              {file ? `Selecionado: ${file.name}` : "Selecionar arquivo"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.saveButton} onPress={salvarExame}>
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
