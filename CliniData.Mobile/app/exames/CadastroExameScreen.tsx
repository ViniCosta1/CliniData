import * as React from "react";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View, Alert, TextInput, ScrollView } from "react-native";
import api from "@/services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

// estilos específicos para elementos DOM (web) — mantidos fora do StyleSheet para não conflitar com tipos RN
const inputWebStyle: any = {
  fontSize: 16,
  padding: 12,
  borderRadius: 8,
  border: "1px solid #d0d0d0",
  width: "100%",
  backgroundColor: "#fafafa",
  boxSizing: "border-box",
  outline: "none",
};

const fileButtonStyle: any = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  padding: 12,
  borderRadius: 8,
  borderStyle: "dashed",
  borderWidth: 1,
  borderColor: "#2ea7ff",
  backgroundColor: "#ffffff",
  color: "#2ea7ff",
  cursor: "pointer",
  boxSizing: "border-box",
  width: "100%",
  gap: 12,
};

export default function CadastroExameScreen() {
  const [tipoExame, setTipoExame] = useState("");
  const [instituicao, setInstituicao] = useState("");
  const [resultado, setResultado] = useState("");
  const [observacao, setObservacao] = useState("");
  const [data, setData] = useState(new Date());
  const [file, setFile] = useState<any | null>(null); // evita dependência estrita de File (web/native)
  const fileInputRef = React.useRef<any>(null); // evita exigir lib.dom para HTMLInputElement

  const formatDateTime = (d: Date) =>
    d.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const handleFileChange = (e: any) => {
    if (e?.target?.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleDateChange = (e: any) => {
    const dt = new Date(e?.target?.value);
    if (!isNaN(dt.getTime())) setData(dt);
  };

  const salvarExame = async () => {
    if (!tipoExame || !data) {
      Alert.alert("Erro", "Preencha os campos obrigatórios.");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("token");

      const formData = new FormData();
      formData.append("TipoExame", tipoExame);
      formData.append("DataHora", data.toISOString());
      formData.append("Instituicao", instituicao);
      formData.append("Resultado", resultado);
      formData.append("Observacao", observacao);

      if (file) {
        formData.append("DocumentoExame", file, file.name);
      }

      // usa a instância axios (interceptor já injeta Authorization). Não forçar Content-Type (boundary).
      await api.post("/api/Exame/upload", formData);

      Alert.alert("Sucesso", "Exame cadastrado!");

      // resetar campos
      setTipoExame("");
      setInstituicao("");
      setResultado("");
      setObservacao("");
      setData(new Date());
      setFile(null);
    } catch (err: any) {
      console.error(err);
      Alert.alert("Erro", "Não foi possível salvar o exame.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.form}>
        <View style={styles.field}>
          <Text style={styles.label}>Tipo do Exame *</Text>
          <TextInput style={styles.input} value={tipoExame} onChangeText={setTipoExame} />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Data do Exame *</Text>
          <input
            type="datetime-local"
            style={inputWebStyle}
            value={data.toISOString().slice(0,16)}
            onChange={handleDateChange}
          />
          <Text>Selecionado: {formatDateTime(data)}</Text>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Instituição</Text>
          <TextInput style={styles.input} value={instituicao} onChangeText={setInstituicao} />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Resultado</Text>
          <TextInput style={styles.input} value={resultado} onChangeText={setResultado} />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Observação</Text>
          <TextInput style={styles.input} value={observacao} onChangeText={setObservacao} />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Documento do Exame</Text>
          {/* input real fica oculto, acionado pelo botão customizado */}
          <input
            ref={(el) => { fileInputRef.current = el; }} // atribui e retorna void (callback ref correta)
            type="file"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
          <div
             role="button"
             tabIndex={0}
             onClick={() => fileInputRef.current?.click()}
             onKeyDown={(e: any) => {
               if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click();
             }}
            style={fileButtonStyle}
           >
             <span style={{ color: "#2ea7ff", fontWeight: 600 }}>Escolher arquivo</span>
             <span style={{ color: "#666" }}>{file ? file.name : "Nenhum arquivo escolhido"}</span>
           </div>
         </View>
       </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.saveButton} onPress={salvarExame}>
          <Text style={styles.saveButtonText}>Salvar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  form: { width: "100%" },
  field: { marginBottom: 24 },
  label: { fontSize: 16, marginBottom: 8, marginLeft: 2 },
  input: { fontSize: 16, padding: 12, backgroundColor: "#fafafa", borderRadius: 8, borderWidth: 1, borderColor: "#d0d0d0" },
  // inputWeb/fileButton moved to web constants to avoid RN style type conflicts
  fileInput: {
    display: "none",
  },
  uploadButton: { backgroundColor: "#fff", paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8, alignItems: "center", marginBottom: 32, borderWidth: 1, borderColor: "#2ea7ff", alignSelf: "flex-start" },
  uploadButtonText: { color: "#2ea7ff", fontWeight: "500", fontSize: 15 },
  footer: { alignItems: "center", marginTop: 24 },
  saveButton: { backgroundColor: "#2ea7ff", paddingVertical: 12, paddingHorizontal: 40, borderRadius: 10, alignItems: "center" },
  saveButtonText: { color: "#fff", fontWeight: "bold", fontSize: 18 },
  scrollContainer: { paddingHorizontal: 16, paddingTop: 32, paddingBottom: 120 },
});
