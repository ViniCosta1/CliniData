import axios from 'axios';

const IP_DA_SUA_API = '192.168.15.8';
const PORTA_DA_SUA_API = '5274';
const PROTOCOLO = 'http';

const api = axios.create({
    baseURL: `${PROTOCOLO}://${IP_DA_SUA_API}:${PORTA_DA_SUA_API}/api`
});

export default api;
