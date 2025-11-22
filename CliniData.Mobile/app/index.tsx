<<<<<<< HEAD
// Cole isso dentro de: app/index.tsx
// (Versão FINAL - Foco no E-mail/Senha e API)

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  SafeAreaView,
  Alert,
} from "react-native";
import { Link, router } from "expo-router";
import api from "./services/api"; // Nosso arquivo de API

const logo = require("../assets/images/logoreal.png"); // Seu logo

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [isLoading, setIsLoading] = useState(false);
=======
import React, { useState } from 'react';
import { 
    View, Text, TextInput, TouchableOpacity, 
    StyleSheet, Image, SafeAreaView, Alert
} from 'react-native';
import { Link, router } from 'expo-router';

// 👉 Caminho correto
import api from './services/api';

const logo = require('../assets/images/logoreal.png');

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [isLoading, setIsLoading] = useState(false);
>>>>>>> 62bebe413d3486efe138443236ddbe963d5caeae

  const handleLogin = async () => {
    setIsLoading(true);
    console.log("clicou");

    try {
      const response = await api.post("/login", {
        email: email,
        password: senha,
      });

<<<<<<< HEAD
      const { accessToken, refreshToken, tokenType } = response.data;

      if (accessToken) {
        console.log("Token recebido:", accessToken);

        // 👉 Aqui você deve salvar o token no AsyncStorage
        // await AsyncStorage.setItem("token", accessToken);

        router.replace("/tabs/home");
      } else {
        Alert.alert(
          "Erro",
          "Login bem-sucedido, mas nenhum token foi recebido."
        );
      }
    } catch (error: any) {
      console.error("Erro na chamada da API:", error);
      let mensagemErro = "Não foi possível fazer o login.";

      if (error.response?.status === 401) {
        mensagemErro = "E-mail ou senha inválidos.";
      } else if (error.request) {
        mensagemErro =
          "Não foi possível conectar ao servidor. Verifique sua rede.";
      }

      Alert.alert("Erro no Login", mensagemErro);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.formContainer}>
        <Image source={logo} style={styles.logo} />
        <Text style={styles.title}>Login</Text>

        <TextInput
          style={styles.input}
          placeholder="E-mail"
          placeholderTextColor="#aaa" // Cor discreta
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          editable={!isLoading}
        />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor="#aaa" // Cor discreta
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
          editable={!isLoading}
        />

        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleLogin}
          //disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? "Entrando..." : "Entrar"}
          </Text>
        </TouchableOpacity>

        <Link href="/register" asChild>
          <TouchableOpacity style={styles.linkButton} disabled={isLoading}>
            <Text style={styles.linkText}>
              Não possui uma conta? Cadastre-se
            </Text>
          </TouchableOpacity>
        </Link>

        <Link href="/password-recovery" asChild>
          <TouchableOpacity style={styles.linkButton} disabled={isLoading}>
            <Text style={styles.linkText}>Esqueci a senha</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </SafeAreaView>
  );
=======
        try {
            // 👉 ROTA exata da sua API
            const response = await api.post('/Auth/login', {
                email: email,
                password: senha
            });

            console.log("Resposta da API:", response.data);

            const token =
                response.data?.token ??
                response.data?.Token ??
                response.data?.access_token;

            if (token) {
                console.log('Token recebido:', token);

                router.replace('/(tabs)/home');

            } else {
                Alert.alert('Erro', 'Nenhum token foi recebido da API.');
            }

        } catch (error: any) {
            console.error('Erro na chamada da API:', error);

            let mensagemErro = 'Não foi possível fazer o login.';

            if (error.response) {
                console.log('Status da API:', error.response.status);
                console.log('Data da API:', error.response.data);

                if (error.response.status === 401)
                    mensagemErro = 'E-mail ou senha inválidos.';

                if (error.response.status === 400)
                    mensagemErro = 'Requisição inválida. Verifique Email e Password.';
            } 
            else if (error.request) {
                mensagemErro = 'Não foi possível conectar ao servidor. Verifique sua rede.';
            }

            Alert.alert('Erro', mensagemErro);

        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.formContainer}>
                
                <Image source={logo} style={styles.logo} />
                <Text style={styles.title}>Login</Text>

                <TextInput
                    style={styles.input}
                    placeholder="E-mail"
                    placeholderTextColor="#aaa"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    editable={!isLoading}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Senha"
                    placeholderTextColor="#aaa"
                    value={senha}
                    onChangeText={setSenha}
                    secureTextEntry
                    editable={!isLoading}
                />

                <TouchableOpacity
                    style={[styles.button, isLoading && styles.buttonDisabled]}
                    onPress={handleLogin}
                    disabled={isLoading}
                >
                    <Text style={styles.buttonText}>
                        {isLoading ? 'Entrando...' : 'Entrar'}
                    </Text>
                </TouchableOpacity>

                <Link href="/register" asChild>
                    <TouchableOpacity style={styles.linkButton} disabled={isLoading}>
                        <Text style={styles.linkText}>
                            Não possui uma conta? Cadastre-se
                        </Text>
                    </TouchableOpacity>
                </Link>

                <Link href="/password-recovery" asChild>
                    <TouchableOpacity style={styles.linkButton} disabled={isLoading}>
                        <Text style={styles.linkText}>Esqueci a senha</Text>
                    </TouchableOpacity>
                </Link>

            </View>
        </SafeAreaView>
    );
>>>>>>> 62bebe413d3486efe138443236ddbe963d5caeae
}

const styles = StyleSheet.create({
<<<<<<< HEAD
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7",
    justifyContent: "center",
    alignItems: "center",
  },
  formContainer: {
    width: "90%",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  logo: { width: 70, height: 70, resizeMode: "contain", marginBottom: 20 },
  title: { fontSize: 24, fontWeight: "bold", color: "#333", marginBottom: 20 },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#fff",
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#007bff",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginTop: 10,
  },
  buttonDisabled: { backgroundColor: "#99caff" },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  linkButton: { marginTop: 15 },
  linkText: { color: "#007bff", fontSize: 14 },
=======
    container: { flex: 1, backgroundColor: '#f7f7f7', justifyContent: 'center', alignItems: 'center' },
    formContainer: { width: '90%', padding: 20, backgroundColor: '#fff', borderRadius: 10, alignItems: 'center', shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.23, shadowRadius: 2.62, elevation: 4 },
    logo: { width: 70, height: 70, resizeMode: 'contain', marginBottom: 20 },
    title: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 20 },
    input: { width: '100%', height: 50, backgroundColor: '#fff', borderColor: '#ddd', borderWidth: 1, borderRadius: 8, paddingHorizontal: 15, marginBottom: 15, fontSize: 16 },
    button: { width: '100%', height: 50, backgroundColor: '#007bff', justifyContent: 'center', alignItems: 'center', borderRadius: 8, marginTop: 10 },
    buttonDisabled: { backgroundColor: '#99caff' },
    buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
    linkButton: { marginTop: 15 },
    linkText: { color: '#007bff', fontSize: 14 }
>>>>>>> 62bebe413d3486efe138443236ddbe963d5caeae
});
