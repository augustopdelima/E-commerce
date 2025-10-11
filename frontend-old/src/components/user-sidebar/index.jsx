import { NavLink } from "react-router";

export default function UserSidebar() {
  return (
    <aside className="nav-sidebar"> 
      <nav className="sidebar-nav">
        <NavLink
          to="/user"
          end
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          Histórico de Pedidos
        </NavLink>
        <NavLink
          to="/user/update"
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          Alterar Dados
        </NavLink>
        <NavLink to="/user/address" className={({isActive}) =>  isActive ? "sidebar-link active" : "sidebar-link"} >
           Cadastrar endereço
         </NavLink>
      </nav>
    </aside>
  );
}
