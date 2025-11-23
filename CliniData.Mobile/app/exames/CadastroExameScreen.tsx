import * as DocumentPicker from "expo-document-picker";
import React, { useState, useEffect } from "react";
import { Platform, StyleSheet, Text, TouchableOpacity, View, Alert, TextInput, ScrollView, KeyboardAvoidingView, Keyboard } from "react-native";
import api from "@/services/api";
import * as FileSystem from "expo-file-system";
import AsyncStorage from "@react-native-async-storage/async-storage";
// require dinâmico (pode não existir em web / não instalado) — trata default/named export
let DateTimePickerModalDynamic: any = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const mod = require("react-native-modal-datetime-picker");
  DateTimePickerModalDynamic = mod && (mod.default || mod);
} catch (e) {
  DateTimePickerModalDynamic = null;
}

export default function CadastroExameScreen() {
  const [tipoExame, setTipoExame] = useState("");
  const [instituicao, setInstituicao] = useState("");
  const [resultado, setResultado] = useState("");
  const [observacao, setObservacao] = useState("");
  const [data, setData] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [tempDate, setTempDate] = useState<Date | null>(null);
  const [formattedDate, setFormattedDate] = useState<string>(() =>
    formatDateTime(new Date())
  );
  const [file, setFile] = useState<any>(null);
  const [showWebPicker, setShowWebPicker] = useState(false);

  function formatDateTime(d: Date) {
    try {
      // exibe data + hora no formato local pt-BR se disponível
      return d.toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`;
    }
  }

  const handleFilePick = async () => {
    try {
      const result: any = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: true,
      });

      // Compatível com várias versões do DocumentPicker:
      // - new: { canceled: false, assets: [{ uri, name, mimeType }] }
      // - older: { type: 'success', uri, name, mimeType }
      // - fallback: { uri, name }
      let uri: string | undefined;
      let name: string | undefined;
      let mime: string | undefined;

      if (result?.canceled === false && Array.isArray(result.assets) && result.assets.length > 0) {
        const asset = result.assets[0];
        uri = asset.uri || asset.uri;
        name = asset.name || asset.fileName;
        mime = asset.mimeType || asset.type;
      } else if (result?.type === "success" || result?.type === "done") {
        uri = result.uri || result.fileUri;
        name = result.name || result.fileName;
        mime = result.mimeType || result.type;
      } else if (result?.uri) {
        uri = result.uri;
        name = result.name || result.fileName;
        mime = result.mimeType || result.type;
      }

      if (uri) {
        const finalName = name || uri.split("/").pop() || "document";
        const finalMime = mime || "application/octet-stream";
        console.log("Arquivo selecionado:", { uri, finalName, finalMime });
        setFile({ uri, name: finalName, type: finalMime });
      } else {
        // usuário cancelou ou formato inesperado
        console.log("Nenhum arquivo selecionado:", result);
      }
    } catch (err) {
      console.log("Erro ao selecionar arquivo:", err);
      Alert.alert("Erro", "Não foi possível selecionar o arquivo.");
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
      formData.append("DataHora", data.toISOString());
      formData.append("Instituicao", instituicao);
      formData.append("Resultado", resultado);
      formData.append("Observacao", observacao);

      if (file) {
        // prepara uri: copia content:// para cache no Android (retorna file://)
        let uploadUri = file.uri;
        const name = file.name || uploadUri.split("/").pop() || "documento.pdf";
        const type = file.type || "application/octet-stream";

        if (uploadUri.startsWith("content://")) {
          try {
            const dest = `${FileSystem.cacheDirectory}${name}`;
            const info = await FileSystem.getInfoAsync(dest);
            if (!info.exists) {
              await FileSystem.copyAsync({ from: uploadUri, to: dest });
            }
            uploadUri = dest;
          } catch (err) {
            console.log("Erro ao copiar arquivo para cache:", err);
            // fallback: continua com uploadUri original
          }
        }

        console.log("Arquivo preparado para upload:", { uploadUri, name, type });
        formData.append("DocumentoExame", {
          uri: uploadUri,
          name,
          type,
        } as any);
      }

      // envia com fetch para garantir multipart/form-data com boundary correto no RN
      const baseURL = (api && (api as any).defaults && (api as any).defaults.baseURL) ? (api as any).defaults.baseURL : "";
      const url = baseURL ? `${baseURL.replace(/\/+$/, "")}/api/exame/upload` : "/api/exame/upload";

      console.log("Enviando exame, formData keys:", Array.from((formData as any)._parts || []));

      const res = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          // não definir Content-Type para que o runtime crie o boundary
        },
        body: formData,
      });

      const respText = await res.text();
      console.log("Upload resposta status:", res.status, "body:", respText);

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${respText}`);
      }

      Alert.alert("Sucesso", "Exame cadastrado!");
    } catch (error: any) {
      console.log("Erro ao salvar exame:", error);
      Alert.alert("Erro", "Não foi possível salvar o exame.");
    }
  };

  // usa DateTimePicker nativo: onChange recebe (event, selectedDate)
  const onChangeDate = (event: any, selected?: Date) => {
    // Android: fecha diálogo automaticamente quando onChange é chamado
    if (Platform.OS === "android") setShowDatePicker(false);
    if (selected) {
      setTempDate(selected);
      // abrir o time picker para completar hora
      setShowTimePicker(true);
    } else {
      setTempDate(null);
    }
  };

  const onChangeTime = (event: any, selected?: Date) => {
    if (Platform.OS === "android") setShowTimePicker(false);
    if (selected) {
      const base = tempDate ?? data;
      const combined = new Date(base);
      combined.setHours(selected.getHours());
      combined.setMinutes(selected.getMinutes());
      combined.setSeconds(0);
      combined.setMilliseconds(0);
      setData(combined);
      setFormattedDate(formatDateTime(combined));
      setTempDate(null);
    }
  };

  // handlers para react-native-modal-datetime-picker (quando disponível)
  const handleConfirmDateModal = (selectedDate: Date) => {
    setTempDate(selectedDate);
    setShowDatePicker(false);
    setShowTimePicker(true);
  };

  const handleConfirmTimeModal = (selectedTime: Date) => {
    const base = tempDate ?? data;
    const combined = new Date(base);
    combined.setHours(selectedTime.getHours());
    combined.setMinutes(selectedTime.getMinutes());
    combined.setSeconds(0);
    combined.setMilliseconds(0);
    setData(combined);
    setFormattedDate(formatDateTime(combined));
    setTempDate(null);
    setShowTimePicker(false);
  };

  // debug: log quando o modal de data muda (ajuda a confirmar se o estado está sendo atualizado)
  useEffect(() => {
    console.log("showDatePicker:", showDatePicker, "showTimePicker:", showTimePicker);
  }, [showDatePicker, showTimePicker]);

  const pad = (n: number) => (n < 10 ? "0" + n : String(n));
  const formatForInput = (d: Date) =>
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
      d.getHours()
    )}:${pad(d.getMinutes())}`;
  const parseFromInput = (v: string) => {
    // v format: "YYYY-MM-DDTHH:MM"
    const dt = new Date(v);
    return isNaN(dt.getTime()) ? null : dt;
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.form}>
          <View style={styles.field}>
            <Text style={styles.label}>Tipo do Exame</Text>
            <TextInput
              style={styles.input}
              value={tipoExame}
              onChangeText={setTipoExame}
              returnKeyType="next"
              onSubmitEditing={() => Keyboard.dismiss()}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Data do Exame</Text>
            <TouchableOpacity
              style={styles.input}
              onPress={() => {
                console.log("Data field pressed. Platform:", Platform.OS);
                if (Platform.OS === "web") {
                  setShowWebPicker(true);
                  return;
                }
                if (DateTimePickerModalDynamic) {
                  setShowDatePicker(true);
                  return;
                }
                setShowDatePicker(true);
              }}
              activeOpacity={0.7}
            >
              <Text>{formattedDate || data.toLocaleDateString()}</Text>
            </TouchableOpacity>

            {/* somente em mobile/nativo: usa modal se disponível, caso contrário fallback via Alert (ver mensagem acima) */}
            {Platform.OS !== "web" && DateTimePickerModalDynamic && (
              <>
                <DateTimePickerModalDynamic
                  isVisible={showDatePicker}
                  mode="date"
                  date={data}
                  onConfirm={handleConfirmDateModal}
                  onCancel={() => setShowDatePicker(false)}
                />
                <DateTimePickerModalDynamic
                  isVisible={showTimePicker}
                  mode="time"
                  date={tempDate ?? data}
                  onConfirm={handleConfirmTimeModal}
                  onCancel={() => setShowTimePicker(false)}
                />
              </>
            )}
            {/* alternativa: quando o modal dinâmico não estiver instalado em native, tentamos o DateTimePicker nativo se seu projeto tiver @react-native-community/datetimepicker */}
            {Platform.OS !== "web" && !DateTimePickerModalDynamic && showDatePicker && (
              // se @react-native-community/datetimepicker estiver presente, onChangeDate tratará; caso contrário, nada aparece e já mostramos o Alert acima.
              <>{/* mantenha onChangeDate/onChangeTime como fallback se o módulo estiver instalado */}</>
            )}

            {/* web picker (rendered input) */}
            {Platform.OS === "web" && showWebPicker && (
              <input
                type="datetime-local"
                value={formatForInput(data)}
                onChange={(e: any) => {
                  const v = e.target.value;
                  const nd = parseFromInput(v);
                  if (nd) {
                    setData(nd);
                    setFormattedDate(formatDateTime(nd));
                  }
                  setShowWebPicker(false);
                }}
                onBlur={() => setShowWebPicker(false)}
                style={{
                  marginTop: 8,
                  padding: 8,
                  borderRadius: 6,
                  border: "1px solid #ccc",
                  fontSize: 16,
                }}
              />
            )}
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
                {file ? `Selecionado: ${file.name || (file.uri ? file.uri.split("/").pop() : "")}` : "Selecionar arquivo"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.saveButton} onPress={salvarExame}>
            <Text style={styles.saveButtonText}>Salvar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  form: { width: "100%" },
  field: { marginBottom: 24 },
  label: { fontSize: 16, marginBottom: 8, marginLeft: 2 },
  input: { fontSize: 16, padding: 12, backgroundColor: "#fafafa", borderRadius: 8, borderWidth: 1, borderColor: "#d0d0d0" },
  uploadButton: { backgroundColor: "#fff", paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8, alignItems: "center", marginBottom: 32, borderWidth: 1, borderColor: "#2ea7ff", alignSelf: "flex-start" },
  uploadButtonText: { color: "#2ea7ff", fontWeight: "500", fontSize: 15 },
  footer: { alignItems: "center", marginTop: 24 },
  saveButton: { backgroundColor: "#2ea7ff", paddingVertical: 12, paddingHorizontal: 40, borderRadius: 10, alignItems: "center" },
  saveButtonText: { color: "#fff", fontWeight: "bold", fontSize: 18 },
  // adiciona estilo para o ScrollView contentContainer
  scrollContainer: {
    paddingHorizontal: 16,
    paddingTop: 32,
    paddingBottom: 120, // garante espaço para botão e teclado
  },
});
