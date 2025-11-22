import axios from 'axios';

<<<<<<< HEAD
const IP_DA_SUA_API = 'localhost'; 

const PORTA_DA_SUA_API = '5274'; 

const PROTOCOLO = 'http'; 
=======
const IP_DA_SUA_API = '192.168.15.8';
const PORTA_DA_SUA_API = '5274';
const PROTOCOLO = 'http';
>>>>>>> 62bebe413d3486efe138443236ddbe963d5caeae

const api = axios.create({
    baseURL: `${PROTOCOLO}://${IP_DA_SUA_API}:${PORTA_DA_SUA_API}`
});

export default api;
