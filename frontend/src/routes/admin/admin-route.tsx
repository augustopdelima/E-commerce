import type { FC } from "react";
import { useAuth } from "../../context/auth";
import { Navigate } from "react-router";

interface AdminRouteProps {
  children?: React.ReactNode;
}

export const AdminRoute: FC<AdminRouteProps> = ({ children }) => {
  const { user, loadingUser } = useAuth();

    if (loadingUser) return <p>Carregando...</p>;

    if(!user) return <Navigate to="/login" replace />;
    if(user.type !== 'admin') return <Navigate to="/" replace />;

  return <>{children}</>;
};
