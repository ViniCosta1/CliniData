import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login/Login";
import DashboardPaciente from "../pages/Paciente/DashboardPaciente";
import DashboardMedico from "../pages/Medico/DashboardMedico";
import DashboardInstituicao from "../pages/Instituicao/DashboardInstituicao";
import NotFound from "../pages/NotFound";
import Cadastro from "../pages/Cadastro/Cadastro";


function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />


      {/* Áreas específicas */}
      <Route path="/paciente/*" element={<DashboardPaciente />} />
      <Route path="/medico/*" element={<DashboardMedico />} />
      <Route path="/instituicao/*" element={<DashboardInstituicao />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;
