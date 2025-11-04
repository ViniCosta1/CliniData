import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ExameDetailsScreen({ route, navigation }: any) {
  const exame = route?.params?.exame ?? { title: 'Sodré', subtitle: 'Exame de sangue' };

  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({
    Plaquetas: true,
    'Glóbulos Brancos': false,
  });

  const toggleExpand = (key: string) => {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>{exame.title}</Text>
        <Text style={styles.subtitle}>{exame.subtitle}</Text>

        <View style={[styles.card, expanded.Plaquetas ? styles.cardOpen : styles.cardClosed]}>
          <TouchableOpacity style={styles.cardHeader} onPress={() => toggleExpand('Plaquetas')}>
            <Text style={styles.cardLabel}>Plaquetas</Text>
            <Ionicons
              name={expanded.Plaquetas ? 'chevron-up-outline' : 'chevron-down-outline'}
              size={20}
              color="#222"
            />
          </TouchableOpacity>
          {expanded.Plaquetas && (
            <View style={styles.cardContent}>
              <Text style={styles.cardValue}>190 mg/L</Text>
            </View>
          )}
        </View>

        <View style={[styles.card, expanded['Glóbulos Brancos'] ? styles.cardOpen : styles.cardClosed]}>
          <TouchableOpacity style={styles.cardHeader} onPress={() => toggleExpand('Glóbulos Brancos')}>
            <Text style={styles.cardLabel}>Glóbulos Brancos</Text>
            <Ionicons
              name={expanded['Glóbulos Brancos'] ? 'chevron-up-outline' : 'chevron-down-outline'}
              size={20}
              color="#222"
            />
          </TouchableOpacity>
          {expanded['Glóbulos Brancos'] && (
            <View style={styles.cardContent}>
              <Text style={styles.cardValue}>7.8 x10³/µL</Text>
            </View>
          )}
        </View>

        <View style={styles.actionsRow}>
          <View style={styles.actionsCenter}>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="create-outline" size={20} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="add-outline" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.gap} />

        {/* spacer para empurrar o botão de download para o final da página */}
        <View style={styles.spacer} />

        <View style={styles.downloadRow}>
          <TouchableOpacity style={styles.downloadButton}>
            <Ionicons name="download-outline" size={18} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.downloadText}>Baixar</Text>
            <Ionicons name="document-outline" size={16} color="#fff" style={{ marginLeft: 8 }} />
          </TouchableOpacity>
        </View>

        {/* Navbar não renderizada manualmente aqui — usar a navbar criada pelo navigator (como em exames.tsx) */}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    paddingHorizontal: 18,
    paddingTop: 24,
    paddingBottom: 100, // espaço reservado para a navbar (evita corte do conteúdo)
    flexGrow: 1, // permite que o conteúdo ocupe a altura e o spacer funcione
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginBottom: 18,
  },
  card: {
    width: '100%',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e8e8e8',
    marginBottom: 12,
    overflow: 'hidden',
    // shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  cardOpen: {
    backgroundColor: '#fff',
  },
  cardClosed: {
    backgroundColor: '#f6f6f6',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  cardLabel: {
    fontWeight: '700',
    fontSize: 16,
  },
  cardContent: {
    paddingHorizontal: 16,
    paddingBottom: 14,
  },
  cardValue: {
    fontSize: 15,
    color: '#444',
    marginTop: 2,
  },
  actionsRow: {
    width: '100%',
    marginTop: 6,
  },
  actionsCenter: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  iconButton: {
    width: 56,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#2ea7ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
    // subtle shadow
    shadowColor: '#2ea7ff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 2,
  },
  gap: {
    height: 18,
  },
  spacer: {
    flex: 1,
    width: '100%',
  },
  downloadRow: {
    width: '100%',
    alignItems: 'flex-start',
    marginBottom: 18,
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2ea7ff',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 20,
    // shadow
    shadowColor: '#2ea7ff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  downloadText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },

  tabLabel: {
    color: '#222',
    fontSize: 14,
  },
});

