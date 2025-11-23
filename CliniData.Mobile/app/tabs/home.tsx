// Cole isso dentro de: app/(tabs)/home.tsx
// (O nosso Dashboard Aprimorado)

import React, { useEffect, useState } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    SafeAreaView, 
    TouchableOpacity,
    Modal,
    ActivityIndicator,
    FlatList,
    ScrollView, // <- adicionado
} from 'react-native';
import { router } from 'expo-router'; // Para navegação
import { Ionicons } from '@expo/vector-icons'; // Para os ícones
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '@/services/api';

export default function HomeScreen() {
    const userName = "Paciente"; 
    const [nextConsulta, setNextConsulta] = useState<any | null>(null);
    const [consultas, setConsultas] = useState<any[]>([]);
    const [logoutModalVisible, setLogoutModalVisible] = useState(false);
    const [checkingAuth, setCheckingAuth] = useState(true);

    useEffect(() => {
        const check = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                if (!token) {
                    router.replace('/');
                    return;
                }
            } catch (e) {
                console.warn('Erro ao verificar token:', e);
                router.replace('/');
                return;
            } finally {
                setCheckingAuth(false);
            }
        };
        check();
    }, []);

    // Formata a string ISO mantendo a hora/data UTC (não converte para o fuso local)
    function fmtDateIsoToPtBr(iso?: string) {
        if (!iso) return "";
        const d = new Date(iso);
        const pad = (n: number) => (n < 10 ? "0" + n : String(n));
        // usa getters UTC para evitar ajuste de timezone local
        const day = pad(d.getUTCDate());
        const month = pad(d.getUTCMonth() + 1);
        const year = d.getUTCFullYear();
        const hours = pad(d.getUTCHours());
        const minutes = pad(d.getUTCMinutes());
        return `${day}/${month}/${year}, ${hours}:${minutes}`;
    }

    useEffect(() => {
        const fetchConsultas = async () => {
            try {
                const resp = await api.get("/api/Consultas");
                const list: any[] = resp.data ?? [];
                // normaliza e adiciona:
                // - dateMs: epoch baseado na ISO parse (UTC)
                // - displayMs: epoch interpretando os componentes da ISO como hora local (para comparação visual)
                // - dataHoraIso: iso normalizada para exibição
                const withMs = list.map((c) => {
                    const dtUtc = new Date(c.dataHora);
                    // tenta extrair componentes da ISO e criar Date local com esses componentes
                    let displayMs = dtUtc.getTime();
                    try {
                        const m = String(c.dataHora).match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):?(\d{2})?/);
                        if (m) {
                            const y = Number(m[1]);
                            const mo = Number(m[2]) - 1;
                            const d = Number(m[3]);
                            const hh = Number(m[4]);
                            const mm = Number(m[5]);
                            const ss = Number(m[6] || "0");
                            // interpreta como horário local (sem ajuste de timezone)
                            displayMs = new Date(y, mo, d, hh, mm, ss).getTime();
                        }
                    } catch {}
    
                    return {
                        ...c,
                        dateMs: dtUtc.getTime(),
                        displayMs,
                        dataHoraIso: dtUtc.toISOString(),
                    };
                });
                // ordenar por displayMs para refletir ordem vista pelo usuário
                withMs.sort((a, b) => a.displayMs - b.displayMs);
                
                // determina próximo agendamento futuro com base na lista completa (displayMs)
                const now = Date.now();
                const future = withMs.filter((c) => c.displayMs >= now);
                setNextConsulta(future.length > 0 ? future[0] : null);
    
                // Exibir 5 a partir da próxima consulta não passada (mais próxima de hoje).
                const startIndex = withMs.findIndex((c) => c.displayMs >= now);
                if (startIndex >= 0) {
                    setConsultas(withMs.slice(startIndex, startIndex + 5));
                } else {
                    // sem futuras: mostrar as últimas 5 consultas (mais recentes do passado)
                    setConsultas(withMs.slice(-5));
                }
            } catch (err) {
                console.warn("Erro ao buscar consultas:", err);
                setConsultas([]);
                setNextConsulta(null);
            }
        };
        fetchConsultas();
    }, []);

    const handleAgendar = () => {
        // Agora podemos habilitar isso!
        router.push('/agendamento'); 
        // Alert.alert("Em Breve", "A tela de agendamento ainda está em construção.");
    };

    const handleMeusExames = () => {
        router.push('/tabs/exames'); 
    };

    const handleLogout = () => {
        // abre modal de confirmação
        setLogoutModalVisible(true);
    };
    
    const confirmLogout = async () => {
        try {
            await AsyncStorage.removeItem('token');
        } catch (e) {
            console.warn('Erro ao limpar token:', e);
        } finally {
            setLogoutModalVisible(false);
            router.replace('/');
        }
    };

    return (
        checkingAuth ? (
            <SafeAreaView style={styles.container}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="#2ea7ff" />
                </View>
            </SafeAreaView>
        ) : (
         <SafeAreaView style={styles.container}>
             {/* Envolve o conteúdo em um ScrollView para permitir rolagem até o botão */}
             <ScrollView
                 style={{ width: '100%' }}
                 contentContainerStyle={{ alignItems: 'center', paddingBottom: 140 }} // espaço para o botão
             >
                {/* 1. Saudação */}
                <View style={styles.header}>
                    <Text style={styles.greetingText}>Olá, {userName}!</Text>
                    <Text style={styles.welcomeText}>Bem-vindo ao CliniData.</Text>
                </View>

                {/* 2. Card de Próximo Agendamento */}
                <View style={styles.infoCard}>
                    <Ionicons name="calendar-outline" size={24} color="#007bff" />
                    <View style={styles.infoCardContent}>
                        <Text style={styles.infoCardTitle}>Próximo Agendamento</Text>
                        {nextConsulta ? (
                            <>
                                <Text style={styles.infoCardText}>
                                    {fmtDateIsoToPtBr(nextConsulta.dataHoraIso)}
                                </Text>
                                {nextConsulta.observacao ? (
                                    <Text style={styles.infoCardText}>{nextConsulta.observacao}</Text>
                                ) : null}
                            </>
                        ) : (
                            <Text style={styles.infoCardText}>Nenhum agendamento encontrado</Text>
                        )}
                    </View>
                </View>

                {/* Lista de todas as consultas (passadas em vermelho) */}
                <View style={{ width: '90%', marginBottom: 20 }}>
                    <Text style={{ fontWeight: '700', marginBottom: 8 }}>Todas as Consultas</Text>
                    <FlatList
                        data={consultas}
                        keyExtractor={(item) => item.idConsulta?.toString() ?? String(item.displayMs ?? item.dateMs)}
                        renderItem={({ item }) => {
                            const compareMs = item.displayMs ?? item.dateMs;
                            const now = new Date();

                            // início do dia atual (local)
                            const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

                            // início do dia da consulta (local, construída a partir de compareMs)
                            const d = new Date(compareMs);
                            const startOfItemDay = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();

                            let isPast = false;
                            let isFuture = false;

                            if (startOfItemDay > startOfToday) {
                                // data estritamente depois de hoje -> futuro
                                isFuture = true;
                            } else if (startOfItemDay < startOfToday) {
                                // dia antes de hoje -> passado
                                isPast = true;
                            } else {
                                // mesmo dia: comparar horário exato
                                if (compareMs < Date.now()) isPast = true;
                                else if (compareMs > Date.now()) isFuture = true;
                            }

                            return (
                                <View
                                    style={[
                                        styles.consultaItem,
                                        isPast && styles.consultaItemPast,
                                        isFuture && styles.consultaItemNext,
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.consultaDate,
                                            isPast && styles.pastText,
                                            isFuture && styles.nextText,
                                        ]}
                                    >
                                        {fmtDateIsoToPtBr(item.dataHoraIso)}
                                    </Text>
                                    {item.observacao ? (
                                        <Text
                                            style={[
                                                styles.consultaObs,
                                                isPast && styles.pastText,
                                                isFuture && styles.nextText,
                                            ]}
                                        >
                                            {item.observacao}
                                        </Text>
                                    ) : null}
                                </View>
                            );
                        }}
                        ListEmptyComponent={<Text style={{ color: '#666' }}>Nenhuma consulta encontrada.</Text>}
                    />
                </View>

                {/* 3. Botões de Ação Rápida */}
                <View style={styles.actionButtonsContainer}>
                    <TouchableOpacity style={styles.actionButton} onPress={handleMeusExames}>
                        <Ionicons name="folder-open-outline" size={30} color="#007bff" />
                        <Text style={styles.actionButtonText}>Meus Exames</Text>
                    </TouchableOpacity>
                </View>

                {/* 4. Ação de Sair - MOVIDO para dentro do ScrollView para ser alcançável */}
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Ionicons name="log-out-outline" size={22} color="#d9534f" />
                    <Text style={styles.logoutButtonText}>Sair</Text>
                </TouchableOpacity>
                
                {/* Modal de confirmação de logout */}
                <Modal visible={logoutModalVisible} transparent animationType="fade">
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Confirmar saída</Text>
                            <Text style={styles.modalMessage}>Deseja realmente sair?</Text>
                            <View style={styles.modalActions}>
                                <TouchableOpacity
                                    style={[styles.modalButton, styles.modalButtonCancel]}
                                    onPress={() => setLogoutModalVisible(false)}
                                >
                                    <Text style={styles.modalButtonText}>Cancelar</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.modalButton, styles.modalButtonConfirm]}
                                    onPress={confirmLogout}
                                >
                                    <Text style={styles.modalButtonText}>Sair</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
             </ScrollView>
         </SafeAreaView>
        )
     );
 }
 
 // Estilos para o novo Dashboard
 const styles = StyleSheet.create({
     container: {
         flex: 1,
         backgroundColor: '#f0f2f5', 
         alignItems: 'center',
         paddingTop: 20, 
     },
     consultaItem: {
         backgroundColor: '#fff',
         padding: 12,
         borderRadius: 8,
         marginBottom: 8,
     },
     consultaItemPast: {
         backgroundColor: '#fff6f6',
     },
     // destaque para o próximo agendamento (azul claro)
     consultaItemNext: {
         backgroundColor: '#e8f4ff',
     },
      consultaDate: {
          fontSize: 14,
          fontWeight: '600',
          color: '#333',
      },
      consultaObs: {
          fontSize: 13,
          color: '#555',
          marginTop: 4,
      },
      pastText: {
          color: '#e3342f',
      },
      nextText: {
          color: '#0b76ff',
      },
     header: {
         width: '90%',
         marginBottom: 20,
         alignItems: 'flex-start',
     },
     greetingText: {
         fontSize: 28,
         fontWeight: 'bold',
         color: '#333',
     },
     welcomeText: {
         fontSize: 16,
         color: '#666',
         marginTop: 5,
     },
     infoCard: {
         width: '90%',
         backgroundColor: '#fff',
         borderRadius: 10,
         padding: 15,
         flexDirection: 'row',
         alignItems: 'center',
         shadowColor: '#000',
         shadowOffset: { width: 0, height: 2 },
         shadowOpacity: 0.1,
         shadowRadius: 3.84,
         elevation: 5,
         marginBottom: 20,
     },
     infoCardContent: {
         marginLeft: 15,
         flex: 1,
     },
     infoCardTitle: {
         fontSize: 16,
         fontWeight: 'bold',
         color: '#333',
         marginBottom: 5,
     },
     infoCardText: {
         fontSize: 14,
         color: '#666',
     },
     viewDetailsButton: {
         marginTop: 10,
         alignSelf: 'flex-start',
     },
     viewDetailsButtonText: {
         color: '#007bff',
         fontWeight: 'bold',
         fontSize: 14,
     },
     actionButtonsContainer: {
         width: '90%',
         flexDirection: 'row',
         justifyContent: 'space-between',
         marginBottom: 30,
     },
     actionButton: {
         backgroundColor: '#fff',
         borderRadius: 10,
         padding: 15,
         alignItems: 'center',
         justifyContent: 'center',
         width: '48%', 
         height: 120, 
         shadowColor: '#000',
         shadowOffset: { width: 0, height: 2 },
         shadowOpacity: 0.1,
         shadowRadius: 3.84,
         elevation: 5,
     },
     actionButtonText: {
         marginTop: 10,
         fontSize: 15,
         fontWeight: 'bold',
         color: '#333',
         textAlign: 'center',
     },
     logoutButton: {
         // removido position: 'absolute' e bottom para permitir rolagem
         flexDirection: 'row',
         alignItems: 'center',
         backgroundColor: '#fff',
         paddingVertical: 10,
         paddingHorizontal: 20,
         borderRadius: 20,
         borderColor: '#d9534f',
         borderWidth: 1,
         marginTop: 10, // espaço acima do botão
         alignSelf: 'center', // centraliza no container
     },
     logoutButtonText: {
         color: '#d9534f',
         marginLeft: 8,
         fontWeight: 'bold',
     },
      modalOverlay: {
         flex: 1,
         backgroundColor: 'rgba(0,0,0,0.5)',
         alignItems: 'center',
         justifyContent: 'center',
     },
     modalContent: {
         width: '85%',
         backgroundColor: '#fff',
         borderRadius: 10,
         padding: 18,
         alignItems: 'center',
     },
     modalTitle: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
     modalMessage: { fontSize: 14, color: '#444', marginBottom: 16, textAlign: 'center' },
     modalActions: { flexDirection: 'row', justifyContent: 'flex-end', width: '100%' },
     modalButton: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 8, marginLeft: 8 },
     modalButtonCancel: { backgroundColor: '#eee' },
     modalButtonConfirm: { backgroundColor: '#d9534f' },
     modalButtonText: { color: '#fff', fontWeight: '700' },
     // ...existing code
 });