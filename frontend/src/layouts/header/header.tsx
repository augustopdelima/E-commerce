import { Link } from "react-router";
import { UserHeader } from "../../components/user-header";
import Logo from "../../assets/logo.svg";

export const Header =  () =>  {

   

    return(
        <header>
            <h1>Sporty's - Energia, estilo e performance</h1>

            <div>
                <div>
                    <Link  to={"/"}>
                        <img src={Logo} alt="Sporty's" height="40"  />
                        <h1>Sporty's</h1>
                    </Link>
                    <nav>
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

