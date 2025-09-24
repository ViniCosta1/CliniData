import React from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function ExameDetailsScreen({ route }: any) {
  const exame = route?.params?.exame ?? { title: 'Sodré', subtitle: 'Exame de sangue' };

  const Row = ({ label, value }: { label: string; value?: string }) => (
    <TouchableOpacity style={styles.row}>
      <View>
        <Text style={styles.rowLabel}>{label}</Text>
        {value ? <Text style={styles.rowValue}>{value}</Text> : null}
      </View>
      <Text style={styles.chevron}>▾</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>{exame.title}</Text>
          <Text style={styles.subtitle}>{exame.subtitle}</Text>

          <View style={styles.rows}>
            <Row label="Plaquetas" value="190 mg/L" />
            <Row label="Glóbulos Brancos" value="7.8 x10^3/µL" />
            <Row label="Hemoglobina" value="14.2 g/dL" />
            <Row label="Observações" />
          </View>

          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.downloadButton}>
              <Text style={styles.downloadText}>Baixar exame ⬇️</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.plusButton}>
              <Text style={styles.plusText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f5f5f5' },
  container: { padding: 16, alignItems: 'center' },
  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  title: { fontSize: 18, fontWeight: '700', marginBottom: 4, textAlign: 'center' },
  subtitle: { fontSize: 14, color: '#666', marginBottom: 12, textAlign: 'center' },
  rows: { width: '100%' },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fafafa',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  rowLabel: { fontWeight: '600' },
  rowValue: { color: '#666', marginTop: 4 },
  chevron: { color: '#888', fontSize: 18 },
  actionsRow: {
    width: '100%',
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  downloadButton: {
    backgroundColor: '#333',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  downloadText: { color: '#fff', fontWeight: '600' },
  plusButton: {
    backgroundColor: '#222',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusText: { color: '#fff', fontWeight: '700', fontSize: 20 },
});

