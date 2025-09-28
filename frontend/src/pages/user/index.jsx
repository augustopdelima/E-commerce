import { useAuth } from "../../context/auth/auth_helpers";
export { default as UserUpdate } from  "./update";
export { default as UserAddressRegister } from "./address-register";
export { default as UserAddress } from "./address-list";
export { default as UserOrders } from "./orders";

export function UserRoute({ children }) {
  const { user, loadingUser } = useAuth();

  if (loadingUser) return <p>Carregando...</p>;

  if (!user) return <Navigate to="/login" replace />;
  if (user.type !== "client") return <Navigate to="/" replace />;

  return children;
}
