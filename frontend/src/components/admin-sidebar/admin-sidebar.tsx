import { NavLink } from "react-router"

export const AdminSidebar = () => {
  return (
    <aside>
      <nav>
        <NavLink to="/admin" end>
            Gerenciar Produtos
        </NavLink>
        <NavLink to="/admin/register-products">
            Cadastrar Produto
        </NavLink>
        <NavLink to="/admin/orders">
            Histórico de Pedidos
        </NavLink>
      </nav>
    </aside>
  );
}