import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { FlatList, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';

type Item = {
  id: string;
  title: string;
  dateAndPlace: string;
  address: string;
};

const DATA: Item[] = [
  {
    id: '1',
    title: 'Exame de sangue',
    dateAndPlace: '17/10/2025 - Laboratório sodré',
    address: 'Rua tal tal - 123',
  },
  {
    id: '2',
    title: 'Raio X',
    dateAndPlace: '20/10/2025 - São Lucas',
    address: 'Rua tal tal - 123',
  },
  {
    id: '3',
    title: 'Ultrassonografia',
    dateAndPlace: '17/11/2025 - São Lucas',
    address: 'Rua tal tal - 123',
  },
];

export default function HomeScreen() {
  const renderItem = ({ item }: { item: Item }) => (
    <View style={styles.card}>
      <View style={styles.cardLeft}>
        <View style={styles.infoIconWrap}>
          <Ionicons name="information-circle-outline" size={20} color="#1976d2" />
        </View>
        <View style={styles.cardText}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardSub}>{item.dateAndPlace}</Text>
          <Text style={styles.cardSub}>{item.address}</Text>
        </View>
      </View>
      <Pressable style={styles.closeButton} onPress={() => { /* implementar remoção se desejar */ }}>
        <Ionicons name="close" size={16} color="#333" />
      </Pressable>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Home</Text>
        <Text style={styles.subtitle}>Exames marcados</Text>
      </View>

      <FlatList
        data={DATA}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
  },
  subtitle: {
    marginTop: 4,
    color: '#777',
  },
  list: {
    paddingTop: 8,
    paddingBottom: 24,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginVertical: 10,
    backgroundColor: '#fff',
    // shadow iOS
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    // elevation Android
    elevation: 2,
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  infoIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    backgroundColor: '#fff',
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    fontWeight: '600',
    marginBottom: 6,
  },
  cardSub: {
    color: '#555',
    fontSize: 13,
    lineHeight: 18,
  },
  closeButton: {
    marginLeft: 12,
    padding: 6,
    borderRadius: 12,
  },
});
