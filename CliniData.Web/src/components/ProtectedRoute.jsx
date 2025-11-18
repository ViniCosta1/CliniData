import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  // ❌ Não está logado → manda para login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // ✅ Logado → libera acesso
  return children;
}
