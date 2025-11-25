import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login/Login";
import Cadastro from "./pages/Cadastro/Cadastro";

// INSTITUIÇÃO
import InstituicaoLayout from "./Layouts/InstituicaoLayout";
import DashboardInstituicao from "./pages/Instituicao/DashboardInstituicao";
import Medicos from "./pages/Instituicao/Medicos";

// MÉDICO
import DashboardMedico from "./pages/Medico/DashboardMedico";
import Prontuario from "./pages/Medico/Prontuario";
import EscolherInstituicao from "./pages/Medico/RealizarConsulta";
import RealizarConsulta from "./pages/Medico/RealizarConsulta";

// NOT FOUND
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <Routes>
      {/* ROTAS PÚBLICAS */}
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />

      {/* ÁREA DA INSTITUIÇÃO (ANINHADA NO LAYOUT) */}
      <Route
        path="/instituicao"
        element={
          <ProtectedRoute>
            <InstituicaoLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardInstituicao />} />
        <Route path="medicos" element={<Medicos />} />
      </Route>

      {/* ÁREA DO MÉDICO (SEM PROTECTED POR ENQUANTO PRA TESTE) */}
      <Route path="/medico/dashboard" element={<DashboardMedico />} />
      <Route
        path="/medico/escolher-instituicao"
        element={<EscolherInstituicao />}
      />

      {/* NOVA TELA: REALIZAR CONSULTA */}
      <Route
        path="/medico/consulta/:consultaId"
        element={<RealizarConsulta />}
      />

      {/* PRONTUÁRIO (pode ser usado depois para histórico) */}
      <Route
        path="/medico/prontuario/:pacienteId/:consultaId"
        element={<Prontuario />}
      />

      {/* ROTA CORINGA */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
