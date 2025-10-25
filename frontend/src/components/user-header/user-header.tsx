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
      <div className="flex items-center gap-2">
        {user?.type === "client" && <CartIcon totalItems={totalItems} />}
        <Link className="text-base font-bold" to={user?.type === "admin" ? "/admin" : "/user"}>
          Bem-vindo, {user?.name}
        </Link>
        <button className="bg-red-400 h-10 p-2 w-16 rounded-sm text-base text-white cursor-pointer hover:bg-red-500" onClick={handleLogout}>Sair</button>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <Link to={"/login"} className="text-base font-bold text-blue-600">Entrar</Link> |{" "}
      <Link to={"/register"} className="text-base font-bold text-blue-600">Registrar-se</Link>
    </div>
  );
};
