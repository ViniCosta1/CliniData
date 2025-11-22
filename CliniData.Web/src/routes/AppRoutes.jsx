import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login/Login";
import Cadastro from "../pages/Cadastro/Cadastro";
import NotFound from "../pages/NotFound";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />
      {/* adicione outras rotas aqui (medico, instituicao, dashboard...) */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
