import { useAuth } from "../../context/auth/auth_helpers";
export { default as UserUpdate } from  "./update";

export function UserRoute({ children }) {
  const { user, loadingUser } = useAuth();

  if (loadingUser) return <p>Carregando...</p>;

  if (!user) return <Navigate to="/login" replace />;
  if (user.type !== "client") return <Navigate to="/" replace />;

  return children;
}
