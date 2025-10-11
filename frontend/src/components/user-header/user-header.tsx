import { Link, useNavigate } from "react-router";
import { useAuth } from "../../context/auth";
import { CartIcon } from "../cart-icon";
import { useCart } from "../../context/cart";

export const UserHeader = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (isAuthenticated) {
    return (
      <div>
        {user?.type === "client" && <CartIcon totalItems={totalItems} />}
        <Link to={user?.type === "admin" ? "/admin" : "/user"}>
          Bem-vindo, {user?.name}
        </Link>
        <button onClick={handleLogout}>Sair</button>
      </div>
    );
  }

  return (
    <div>
      <Link to={"/login"}>Entrar</Link> |{" "}
      <Link to={"/register"}>Registrar-se</Link>
    </div>
  );
};
