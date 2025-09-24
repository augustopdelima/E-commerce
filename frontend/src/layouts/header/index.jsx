import "./index.css";
import Logo from "../../assets/logo.svg";
import { Link } from "react-router";

function Header() {
  return (
    <header className="header">
      <div className="header-top">Sporty’s – Energia, estilo e performance</div>

      <div className="header-bottom">
        <div className="header-logo">
          <img src={Logo} alt="Sporty’s" height="40" />
          <h1>Sporty’s</h1>
          <nav className="header-categories">
            <Link to={"/"}>Roupas</Link>
            <Link to={"/"}>Calçados</Link>
            <Link to={"/"}>Acessórios</Link>
            <Link to={"/"}>Suplementos</Link>
          </nav>
        </div>
        <div className="header-user">
          <a href="/login">Login</a>
          <a href="/register">Cadastro</a>
        </div>
      </div>
    </header>
  );
}

export default Header;
