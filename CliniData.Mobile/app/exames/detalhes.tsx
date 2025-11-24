import { Ionicons } from '@expo/vector-icons';
import React, { useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, Alert, Share, Platform } from 'react-native';
import api from '@/services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams } from 'expo-router';
import * as FileSystem from 'expo-file-system/legacy';
import { router } from 'expo-router';

export default function ExameDetailsScreen({ route, navigation }: any) {
  // não definir fallback aqui — queremos saber se exame foi passado ou não
  const paramExame = route?.params?.exame ?? null;
  const searchParams = useLocalSearchParams();
  const [checkingAuth, setCheckingAuth] = useState(true);
 
  // Detecta id vindo de várias formas (route param, idExame, objeto exame, querystring)
  const getRouteId = () => {
    if (route?.params?.id) return route.params.id;
    if (route?.params?.idExame) return route.params.idExame;
    if (route?.params?.exame?.idExame) return route.params.exame.idExame;
    if (searchParams?.id) return searchParams.id;
    return null;
  };
  const routeId = getRouteId();

  const [exameData, setExameData] = useState<any>(paramExame);
  const [loading, setLoading] = useState<boolean>(!paramExame && !!routeId);
 
  useEffect(() => {
     // se já veio o exame por navigation, não precisa buscar
     if (paramExame) {
       setLoading(false);
       return;
     }
 
     if (!routeId) {
       setLoading(false);
       return;
     }
 
    // checagem de autenticação separada (executa antes do fetchExame se ainda checando)
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          router.replace('/');
          return false;
        }
        return true;
      } catch (e) {
        console.warn('Erro ao verificar token:', e);
        router.replace('/');
        return false;
      } finally {
        setCheckingAuth(false);
      }
    };

    // se ainda checando, aguardar verificação antes de buscar
    (async () => {
      const ok = await checkAuth();
      if (!ok) return;
      // existente: fetchExame executará abaixo (mantive fluxo)
    })();
 
     const fetchExame = async () => {
       setLoading(true);
       try {
         const token = await AsyncStorage.getItem('token');
         const res = await api.get(`/api/exame/${routeId}`, {
           headers: token ? { Authorization: `Bearer ${token}` } : undefined,
         });
         // assumir que o body útil está em res.data
         setExameData(res.data);
       } catch (err) {
         console.warn('Erro ao buscar exame:', err);
         Alert.alert('Erro', 'Não foi possível carregar os detalhes do exame.');
       } finally {
         setLoading(false);
       }
     };
 
     fetchExame();
   }, [routeId, paramExame]);
 
   if (checkingAuth) {
     return (
       <SafeAreaView style={styles.safe}>
         <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
           <ActivityIndicator size="large" color="#2ea7ff" />
         </View>
       </SafeAreaView>
     );
   }
 
   // helper para formatar datas ISO para exibição
   const formatDate = (iso?: string) => {
     if (!iso) return '';
     try {
       return new Date(iso).toLocaleString();
     } catch {
       return iso;
     }
   };

   // download do arquivo: rota separada para web (forçar download no browser) e para nativo (downloadAsync + Share)
   const handleDownload = async () => {
     const id = exameData?.idExame ?? exameData?.id ?? routeId;
     if (!id) {
       Alert.alert('Sem ID', 'Não foi possível identificar o exame para download.');
       return;
     }

     const token = await AsyncStorage.getItem('token');
     const baseUrl = (api as any)?.defaults?.baseURL ?? '';
     const url = `${baseUrl}/api/exame/${id}/arquivo`.replace(/([^:]\/)\/+/g, '$1');

     try {
       if (Platform.OS === 'web') {
         // no web: fetch e criar download via blob + anchor
         const resp = await fetch(url, { method: 'GET', headers: token ? { Authorization: `Bearer ${token}` } : {} });
         if (!resp.ok) {
           if (resp.status === 404) Alert.alert('Sem arquivo', 'Arquivo não encontrado.');
           else Alert.alert('Erro', `Falha ao baixar (status ${resp.status}).`);
           return;
         }
         const blob = await resp.blob();
         if (!blob || blob.size === 0) {
           Alert.alert('Sem arquivo', 'Não há arquivo disponível para download neste exame.');
           return;
         }
         const contentType = resp.headers.get('content-type') ?? 'application/octet-stream';
         const ext = contentType.includes('jpeg') || contentType.includes('jpg') ? 'jpg' : contentType.includes('png') ? 'png' : '';
         const filename = `exame_${id}${ext ? '.' + ext : ''}`;
         const blobUrl = URL.createObjectURL(blob);
         const a = document.createElement('a');
         a.href = blobUrl;
         a.download = filename;
         document.body.appendChild(a);
         a.click();
         a.remove();
         URL.revokeObjectURL(blobUrl);
         return;
       }

      // nativo: usar FileSystem.downloadAsync (legacy) e depois abrir Share
      const extGuess = 'png';
      const filename = `exame_${id}.${extGuess}`;
      const baseDir = (FileSystem as any).cacheDirectory ?? (FileSystem as any).documentDirectory ?? '';
      const fileUri = baseDir + filename;

      const downloadRes = await FileSystem.downloadAsync(url, fileUri, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!downloadRes || !downloadRes.status || Math.floor(downloadRes.status / 100) !== 2) {
        Alert.alert('Erro', `Falha ao baixar (status ${downloadRes?.status}).`);
        return;
      }

      const shareUri = downloadRes.uri.startsWith('file://') ? downloadRes.uri : `file://${downloadRes.uri}`;
      await Share.share({ url: shareUri });
     } catch (err: any) {
       console.warn('Erro ao baixar arquivo:', err);
       Alert.alert('Erro', 'Não foi possível baixar o arquivo.');
     }
   };
 
   if (loading) {
     return (
       <SafeAreaView style={styles.safe}>
         <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
           <ActivityIndicator size="large" color="#2ea7ff" />
         </View>
       </SafeAreaView>
     );
   }
 
   const exame = exameData ?? { title: '—', subtitle: 'Detalhes indisponíveis' };
 
   return (
     <SafeAreaView style={styles.safe}>
       <ScrollView contentContainerStyle={styles.container}>
         <View style={styles.header}>
           <Text style={styles.title}>{exame.tipoExame ?? exame.title ?? 'Sem título'}</Text>
           <Text style={styles.subtitle}>{exame.instituicao ?? exame.subtitle ?? ''}</Text>
           <Text style={styles.date}>{formatDate(exame.dataHora ?? exame.data)}</Text>
         </View>
 
         <View style={styles.infoCard}>
           <Text style={styles.infoLabel}>Resultado</Text>
           <Text style={styles.infoText}>{exame.resultado ?? '—'}</Text>
 
           <Text style={[styles.infoLabel, { marginTop: 12 }]}>Observação</Text>
           <Text style={styles.infoText}>{exame.observacao ?? '—'}</Text>
         </View>
 
         {/* botão de download: visível sempre; desabilitado se não houver arquivo */}
         <TouchableOpacity
           style={[
             styles.downloadButton,
             !(exameData?.idExame ?? exameData?.id ?? routeId) && styles.downloadButtonDisabled,
           ]}
           onPress={handleDownload}
           disabled={!(exameData?.idExame ?? exameData?.id ?? routeId)}
         >
           <Ionicons name="download-outline" size={18} color="#fff" style={{ marginRight: 8 }} />
           <Text style={styles.downloadButtonText}>Baixar Arquivo</Text>
         </TouchableOpacity>
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
   header: {
     width: '100%',
     alignItems: 'center',
     marginBottom: 18,
   },
   date: {
     color: '#666',
     marginTop: 6,
   },
   infoCard: {
     width: '100%',
     backgroundColor: '#fff',
     borderRadius: 12,
     padding: 16,
     marginBottom: 14,
     shadowColor: '#000',
     shadowOffset: { width: 0, height: 4 },
     shadowOpacity: 0.06,
     shadowRadius: 8,
     elevation: 2,
   },
   infoLabel: { fontWeight: '700', color: '#333' },
   infoText: { color: '#444', marginTop: 6, lineHeight: 20 },
   downloadButton: {
     flexDirection: 'row',
     alignItems: 'center',
     backgroundColor: '#2ea7ff',
     paddingVertical: 10,
     paddingHorizontal: 16,
     borderRadius: 12,
     marginTop: 10,
   },
   downloadButtonDisabled: {
     backgroundColor: '#b6d8f5',
   },
   downloadButtonText: {
     color: '#fff',
     fontWeight: '600',
   },
 });

