import { NavLink } from "react-router";
import "./index.css";

export default function AdminSidebar() {
  return (
    <aside className="admin-sidebar"> 
      <nav className="sidebar-nav">
        <NavLink
          to="/admin"
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          Gerenciar Produtos
        </NavLink>
        <NavLink
          to="/admin/register-products"
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          Cadastrar Produto
        </NavLink>
        <NavLink
          to="/admin/orders"
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          Histórico de Pedidos
        </NavLink>
      </nav>
    </aside>
  );
}
