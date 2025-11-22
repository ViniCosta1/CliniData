import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";


import Login from "./pages/Login/Login";

import InstituicaoLayout from "./Layouts/InstituicaoLayout";
import DashboardInstituicao from "./pages/Instituicao/DashboardInstituicao";
import Medicos from "./pages/Instituicao/Medicos";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />

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
    </Routes>
  );
}
   s