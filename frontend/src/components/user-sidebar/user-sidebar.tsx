import { NavLink } from "react-router";

export const UserSidebar = () => {
  return (
    <aside>
      <nav>
        <NavLink
          to="/user"
          end 
        >
          Histórico de Pedidos
        </NavLink>
        <NavLink
          to="/user/update"
        >
          Alterar Dados
        </NavLink>
        <NavLink to="/user/address">
           Cadastrar endereço
         </NavLink>
      </nav>
    </aside>
  );
}

