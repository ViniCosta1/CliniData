import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// TROQUE AQUI PELO QUE VOCÊ ESTÁ USANDO
const IP_DA_API = "localhost"; // emulador android
const PORTA = "7067";
const PROTOCOLO = "https";

// Exemplo mínimo de instancia; ajuste baseURL conforme seu projeto.
const api = axios.create({
  baseURL: `${PROTOCOLO}://${IP_DA_API}:${PORTA}`,
  timeout: 30000,
});

api.defaults.headers.post["Accept"] = "application/json";

// ⬇ Interceptor para enviar token automaticamente
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});



export default api;
