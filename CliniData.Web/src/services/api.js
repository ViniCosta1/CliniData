import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5274" // troque se sua API rodar em outra porta/host
});

export default api;
