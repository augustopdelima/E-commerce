import RegisterProducts from "./register-products";
export { RegisterProducts };

import { Navigate } from "react-router";
import { useAuth } from "../../context/auth/auth_helpers";

export function AdminRoute({ children }) {
  const { user, loadingUser } = useAuth();

  if (loadingUser) return <p>Carregando...</p>;

  if (!user) return <Navigate to="/login" replace />;
  if (user.type !== "admin") return <Navigate to="/" replace />;

  return children;
}