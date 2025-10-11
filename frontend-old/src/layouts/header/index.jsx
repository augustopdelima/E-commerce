import "./index.css";
import Logo from "../../assets/logo.svg";
import { Link } from "react-router";
import { useAuth } from "../../context/auth/auth_helpers";
import { useNavigate } from "react-router";
import CartIcon from "../../components/cart-icon";
import { useCart } from "../../context/cart/cart_hook";
function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="header">
      <div className="header-top">Sporty’s – Energia, estilo e performance</div>

      <div className="header-bottom">
        <div className="header-logo">
          <Link className="header-logo-link" to={"/"}>
            <img src={Logo} alt="Sporty’s" height="40" />
            <h1>Sporty’s</h1>
          </Link>
          <nav className="header-categories">
            <Link to={"/"}>Roupas</Link>
            <Link to={"/"}>Calçados</Link>
            <Link to={"/"}>Acessórios</Link>
            <Link to={"/"}>Suplementos</Link>
          </nav>
        </div>
        <div className="header-user">
          {isAuthenticated ? (
            <div className="header-user-authenticated">
              {user.type === "client" && <CartIcon totalItems={totalItems} />}
              <Link to={user.type === "admin" ? "/admin" : "/user"}>
                Bem-vindo, {user?.name}
              </Link>
              <button className="button-logout" onClick={handleLogout}>
                Sair
              </button>
            </div>
          ) : (
            <div>
              <Link to={"/login"}>Entrar</Link> |{" "}
              <Link to={"/register"}>Registrar-se</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
