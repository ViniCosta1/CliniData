import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ExameDetailsScreen({ route }: any) {
  const exame = route?.params?.exame ?? { title: 'Sodré', subtitle: 'Exame de sangue' };

  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({
    Plaquetas: true,
    'Glóbulos Brancos': false,
  });

  const toggleExpand = (key: string) => {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{exame.title}</Text>
      <Text style={styles.subtitle}>{exame.subtitle}</Text>

      <View
        style={[
          styles.card,
          { backgroundColor: expanded.Plaquetas ? '#fff' : '#f5f5f5' }
        ]}
      >
        <TouchableOpacity
          style={styles.cardHeader}
          onPress={() => toggleExpand('Plaquetas')}
        >
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

      <View
        style={[
          styles.card,
          { backgroundColor: expanded['Glóbulos Brancos'] ? '#fff' : '#f5f5f5' }
        ]}
      >
        <TouchableOpacity
          style={styles.cardHeader}
          onPress={() => toggleExpand('Glóbulos Brancos')}
        >
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
        <View style={styles.actionsRight}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="create-outline" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="add-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.spacer} />
      <View style={styles.downloadRow}>
        <TouchableOpacity style={styles.downloadButton}>
          <Ionicons name="download-outline" size={18} color="#fff" style={{ marginRight: 6 }} />
          <Text style={styles.downloadText}>Baixar Exame</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 18,
    paddingTop: 32,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 2,
    marginTop: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginBottom: 18,
  },
  card: {
    width: '100%',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    backgroundColor: '#fff',
    marginBottom: 12,
    overflow: 'hidden',
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
    paddingBottom: 12,
  },
  cardValue: {
    fontSize: 15,
    color: '#444',
    marginTop: 2,
  },
  actionsRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 0,
  },
  actionsRight: {
    flexDirection: 'row',
    gap: 16,
  },
  actionButton: {
    backgroundColor: '#21a366',
    paddingVertical: 10,
    paddingHorizontal: 28,
    borderRadius: 8,
    alignItems: 'center',
    marginLeft: 8,
  },
  spacer: {
    flex: 1,
  },
  downloadRow: {
    width: '100%',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#21a366',
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 8,
  },
  downloadText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});

