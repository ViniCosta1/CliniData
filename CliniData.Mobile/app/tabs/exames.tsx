import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

type Exame = {
  id: string;
  title: string;
  subtitle: string;
};

const DATA: Exame[] = [
  { id: '1', title: 'Sangue - Hemograma', subtitle: 'Laboratório Central' },
  { id: '2', title: 'Ultrassom Abdominal', subtitle: 'Hospital São Lucas' },
  { id: '3', title: 'Raio-X Torácico', subtitle: 'Clínica Radiológica' },
];

export default function ExamesScreen() {
  const navigation = useNavigation<any>();

  const navigateToDetails = (item: Exame) => {
    const params = { exame: item };

    // helper to check route existence on a navigator
    const hasRoute = (nav: any, name: string) =>
      !!nav?.getState?.()?.routeNames?.includes?.(name);

    // 1) current navigator: usar o nome de rota "detalhes"
    if (hasRoute(navigation, 'detalhes')) {
      navigation.navigate('detalhes' as any, params);
      return;
    }

    if (hasRoute(navigation, 'Exames')) {
      navigation.navigate('Exames' as any, { screen: 'detalhes', params });
      return;
    }

    // 2) parent navigator(s)
    const parent = navigation.getParent?.();
    if (parent) {
      if (hasRoute(parent, 'detalhes')) {
        parent.navigate('detalhes' as any, params);
        return;
      }
      if (hasRoute(parent, 'Exames')) {
        parent.navigate('Exames' as any, { screen: 'detalhes', params });
        return;
      }
      const grandParent = parent.getParent?.();
      if (grandParent && hasRoute(grandParent, 'detalhes')) {
        grandParent.navigate('detalhes' as any, params);
        return;
      }
    }

    // fallback: informar que a rota não foi encontrada — registrar a rota no navigator
    console.warn(
      "Nenhum navigator possui a rota 'ExameDetailsScreen'. Verifique a configuração de rotas (route names) na árvore de navegação."
    );
  };

  const renderItem = ({ item }: { item: Exame }) => (
    <View style={styles.card}>
      <View style={styles.imagePlaceholder} />
      <View style={styles.cardContent}>
        <View>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.subtitle}>{item.subtitle}</Text>
        </View>
        <TouchableOpacity
          style={styles.detailButton}
          onPress={() => {
            navigateToDetails(item);
          }}
        >
          <Text style={styles.detailButtonText}>Detalhes</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Exames</Text>

      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.addButtonText}>Inserir novo exame +</Text>
      </TouchableOpacity>

      <FlatList
        data={DATA}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
  },
  addButton: {
    backgroundColor: '#2e8b57',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  list: {
    paddingBottom: 24,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    alignItems: 'flex-start',
    // sombra leve
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  imagePlaceholder: {
    width: 100,
    height: 100,
    backgroundColor: '#d0d0d0', // quadrado cinza no lugar da imagem
    borderRadius: 6,
    marginRight: 12,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  detailButton: {
    backgroundColor: '#2e8b57',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  detailButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});


