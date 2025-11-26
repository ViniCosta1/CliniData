import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:7067" // troque se sua API rodar em outra porta/host
});

export default api;
