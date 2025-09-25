import React from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

export default function LoginScreen() {


  return (

      <View style={styles.card}>
        <Text style={styles.label}>CPF</Text>
        <TextInput style={styles.input} placeholder="CPF" />

        <Text style={[styles.label, { marginTop: 12 }]}>Senha</Text>
        <TextInput style={styles.input} placeholder="Senha" secureTextEntry />

        <Pressable style={styles.signin} >
          <Text style={styles.signinText}>Entrar</Text>
        </Pressable>

        <Pressable>
          <Text style={styles.link}>Não possui uma conta?</Text>
        </Pressable>
      </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f6f6f6', justifyContent: 'center', padding: 20 },
  card: { backgroundColor: '#fff', padding: 18, borderRadius: 6, borderWidth: 1, borderColor: '#eee' },
  label: { fontSize: 13, color: '#222', marginBottom: 6 },
  input: { borderWidth: 1, borderColor: '#eee', borderRadius: 6, paddingHorizontal: 10, paddingVertical: 8, backgroundColor: '#fafafa' },
  signin: { marginTop: 12, backgroundColor: '#0a9533', paddingVertical: 10, borderRadius: 6, alignItems: 'center' },
  signinText: { color: '#fff', fontWeight: '600' },
  link: { marginTop: 12, textAlign: 'center', color: '#1976d2', textDecorationLine: 'underline' },
});
