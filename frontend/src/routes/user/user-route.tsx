import { Navigate } from "react-router";
import { useAuth } from "../../context/auth"
import type { ReactNode, FC } from "react";

interface UserRouteProps {
    children:ReactNode
}

export const UserRoute:FC<UserRouteProps> = ({ children }) => {
    const { user, loadingUser } = useAuth();

    if(loadingUser) return <p>Carregando...</p>;

    if(!user) return <Navigate to="/login" replace/>;
    if(user.type !== "client") return <Navigate to="/" replace />;

    return <>{children}</>
} 