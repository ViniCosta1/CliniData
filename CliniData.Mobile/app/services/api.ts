import axios from 'axios';

const IP_DA_SUA_API = 'localhost'; 

const PORTA_DA_SUA_API = '5274'; 

const PROTOCOLO = 'http'; 

const api = axios.create({
    baseURL: `${PROTOCOLO}://${IP_DA_SUA_API}:${PORTA_DA_SUA_API}`
});

export default api;