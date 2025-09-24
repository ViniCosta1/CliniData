import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';

export default function RegisterScreen() {
  const navigation = useNavigation<any>();
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.label}>CPF</Text>
        <TextInput style={styles.input} placeholder="Value" value={cpf} onChangeText={setCpf} />

        <Text style={[styles.label, { marginTop: 12 }]}>E-mail</Text>
        <TextInput style={styles.input} placeholder="Value" value={email} onChangeText={setEmail} keyboardType="email-address" />

        <Text style={[styles.label, { marginTop: 12 }]}>Senha</Text>
        <TextInput style={styles.input} placeholder="Value" value={password} onChangeText={setPassword} secureTextEntry />

        <Text style={[styles.label, { marginTop: 12 }]}>Repita a senha</Text>
        <TextInput style={styles.input} placeholder="Value" value={password2} onChangeText={setPassword2} secureTextEntry />

        <Pressable style={styles.register} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.registerText}>Registrar</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f6f6f6', justifyContent: 'center', padding: 20 },
  card: { backgroundColor: '#fff', padding: 18, borderRadius: 6, borderWidth: 1, borderColor: '#eee' },
  label: { fontSize: 13, color: '#222', marginBottom: 6 },
  input: { borderWidth: 1, borderColor: '#eee', borderRadius: 6, paddingHorizontal: 10, paddingVertical: 8, backgroundColor: '#fafafa' },
  register: { marginTop: 16, backgroundColor: '#0a9533', paddingVertical: 10, borderRadius: 6, alignItems: 'center' },
  registerText: { color: '#fff', fontWeight: '600' },
});
