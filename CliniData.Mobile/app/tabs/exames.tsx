import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Modal,
  ActivityIndicator,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import api from "@/services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

// --- Componente de Card ---
const ExameCard = ({ item, onDelete }: { item: any; onDelete: (id: number) => void }) => {
  const handlePress = () => {
    // navega para a tela de detalhes passando id como query param
    router.push(`/exames/detalhes?id=${item.idExame}`);
  };

  return (
    <View style={styles.card}>
      <TouchableOpacity style={styles.cardContent} onPress={handlePress} activeOpacity={0.8}>
        <Ionicons name={item.icon as any} size={24} style={styles.cardIcon} />
        <View style={styles.cardTextContainer}>
          <Text style={styles.cardTitle}>{item.tipoExame}</Text>
          <Text style={styles.cardSubtitle}>{item.instituicao}</Text>
          <Text style={styles.cardDate}>{item.dataHora}</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => onDelete(item.idExame)}
        accessibilityLabel="Excluir exame"
      >
        <Ionicons name="trash" size={18} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

// --- Tela Principal ---
export default function ExamesScreen() {
  const [exames, setExames] = useState<any[]>([]);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedExameId, setSelectedExameId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const check = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          router.replace("/");
          return;
        }
      } catch (e) {
        console.warn("Erro ao verificar token:", e);
        router.replace("/");
        return;
      } finally {
        setCheckingAuth(false);
      }
    };
    check();
  }, []);

  useEffect(() => {
    const fetchExames = async () => {
      try {
        const response = await api.get("/api/exame/me");
        setExames(response.data ?? []);
      } catch (error) {
        console.warn("Failed to load exames:", error);
        setExames([]);
      }
    };
    fetchExames();
  }, []);

  const handleAgendar = () => {
    // Navega para a tela de cadastro do exame
    router.push("/exames/CadastroExameScreen");
  };

  // abre modal de confirmação
  const deleteExame = (idExame: number) => {
    setSelectedExameId(idExame);
    setDeleteModalVisible(true);
  };

  // confirma exclusão (chama API e remove localmente)
  const confirmDelete = async () => {
    if (selectedExameId == null) return;
    setIsDeleting(true);
    try {
      const token = await AsyncStorage.getItem("token");
      await api.delete(`/api/exame/${selectedExameId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExames((prev) => prev.filter((e) => e.idExame !== selectedExameId));
      setDeleteModalVisible(false);
      setSelectedExameId(null);
      Alert.alert("Sucesso", "Exame excluído.");
    } catch (err) {
      console.warn("Erro ao excluir exame:", err);
      Alert.alert("Erro", "Não foi possível excluir o exame.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (checkingAuth) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color="#2ea7ff" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Modal de confirmação de exclusão */}
      <Modal visible={deleteModalVisible} transparent animationType="fade">
        <View style={modalStyles.overlay}>
          <View style={modalStyles.modal}>
            <Text style={modalStyles.title}>Confirmar exclusão</Text>
            <Text style={modalStyles.message}>Deseja realmente excluir este exame?</Text>
            <View style={modalStyles.actions}>
              <TouchableOpacity
                style={[modalStyles.btn, modalStyles.cancelBtn]}
                onPress={() => {
                  setDeleteModalVisible(false);
                  setSelectedExameId(null);
                }}
                disabled={isDeleting}
              >
                <Text style={modalStyles.cancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[modalStyles.btn, modalStyles.deleteBtn]}
                onPress={confirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? <ActivityIndicator color="#fff" /> : <Text style={modalStyles.deleteText}>Excluir</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Text style={styles.headerTitle}>Meus Exames</Text>

      <TouchableOpacity style={styles.addButton} onPress={handleAgendar}>
        <Ionicons name="add" size={20} color="#fff" />
        <Text style={styles.addButtonText}>Agendar Novo Exame</Text>
      </TouchableOpacity>

      <FlatList
        data={exames}
        renderItem={({ item }) => <ExameCard item={item} onDelete={deleteExame} />}
        keyExtractor={(item) => item.idExame.toString()}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
}

// --- Estilos (mesmos estilos que você já tinha) ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f2f5",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginTop: 20,
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#007bff",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    justifyContent: "space-between",
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  cardIcon: {
    marginRight: 15,
  },
  cardTextContainer: {
    flex: 1,
  },
  deleteButton: {
    marginLeft: 12,
    backgroundColor: "#e3342f",
    padding: 8,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 3,
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#555",
    marginBottom: 3,
  },
  cardDate: {
    fontSize: 13,
    color: "#777",
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginLeft: 10,
  },
  statusText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
});

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  modal: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
  },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 8 },
  message: { fontSize: 14, color: "#333", marginBottom: 16, textAlign: "center" },
  actions: { flexDirection: "row", width: "100%", justifyContent: "flex-end" },
  btn: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 6, marginLeft: 8 },
  cancelBtn: { backgroundColor: "#eee" },
  deleteBtn: { backgroundColor: "#e3342f" },
  cancelText: { color: "#333", fontWeight: "600" },
  deleteText: { color: "#fff", fontWeight: "600" },
});