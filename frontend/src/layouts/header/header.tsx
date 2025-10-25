import { Link } from "react-router";
import { UserHeader } from "../../components/user-header";
import Logo from "../../assets/logo.svg";

export const Header = () => {
  return (
    <header className="w-full flex flex-col items-center  justify-between  border-b border-gray-300 box-border">
      <h1 className="w-full text-center font-light text-xl bg-indigo-900 text-white h-10">Sporty's - Energia, estilo e performance</h1>

      <div className="w-full flex justify-between px-8 py-4 items-center">
        <div className="flex flex-1 gap-8">
          <Link className="flex gap-2" to={"/"}>
            <img src={Logo} alt="Sporty's" height="40" />
            <h1 className="text-lg font-bold">Sporty's</h1>
          </Link>
          <nav className="flex gap-2">
            <Link to={"/"}>Roupas</Link>
            <Link to={"/"}>Calçados</Link>
            <Link to={"/"}>Acessórios</Link>
            <Link to={"/"}>Suplementos</Link>
          </nav>
        </div>
        <div>
          <UserHeader />
        </div>
      </div>
    </header>
  );
};
