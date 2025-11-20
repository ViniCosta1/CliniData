import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import api from "@/services/api";

// --- Componente de Card ---
const ExameCard = ({ item }: { item: any }) => {
  const handlePress = () => {
    router.push(`/exames/${item.idExame}`);
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress}>
      <Ionicons name={item.icon as any} size={24} style={styles.cardIcon} />
      <View style={styles.cardTextContainer}>
        <Text style={styles.cardTitle}>{item.tipoExame}</Text>
        <Text style={styles.cardSubtitle}>{item.instituicao}</Text>
        <Text style={styles.cardDate}>{item.dataHora}</Text>
      </View>
    </TouchableOpacity>
  );
};

// --- Tela Principal ---
export default function ExamesScreen() {
  const [exames, setExames] = useState<any[]>([]);

  useEffect(() => {
    const fetchExames = async () => {
      try {
        const response = await api.get("/api/exames");
        setExames(response.data ?? []);
      } catch (error) {
        console.warn("Failed to load exames:", error);
        setExames([]);
      }
    };
    fetchExames();
  }, []);

  const handleAgendar = () => {
    Alert.alert("Em breve", "A tela de agendamento ainda está em construção.");
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerTitle}>Meus Exames</Text>

      <TouchableOpacity style={styles.addButton} onPress={handleAgendar}>
        <Ionicons name="add" size={20} color="#fff" />
        <Text style={styles.addButtonText}>Agendar Novo Exame</Text>
      </TouchableOpacity>

      <FlatList
        data={exames}
        renderItem={({ item }) => <ExameCard item={item} />}
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
  },
  cardIcon: {
    marginRight: 15,
  },
  cardTextContainer: {
    flex: 1,
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
