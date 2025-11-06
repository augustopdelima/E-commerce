import { NavLink } from "react-router";

export const AdminSidebar = () => {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen p-6">
      <nav className="flex flex-col space-y-3">
        <NavLink
          to="/admin"
          end
          className={({ isActive }) =>
            `block px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
              isActive
                ? "bg-blue-600 text-white shadow"
                : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
            }`
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/admin/products"
          className={({ isActive }) =>
            `block px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
              isActive
                ? "bg-blue-600 text-white shadow"
                : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
            }`
          }
        >
          Gerenciar Produtos
        </NavLink>

        <NavLink
          to="/admin/register-products"
          className={({ isActive }) =>
            `block px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
              isActive
                ? "bg-blue-600 text-white shadow"
                : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
            }`
          }
        >
          Cadastrar Produto
        </NavLink>

        <NavLink
          to="/admin/orders"
          className={({ isActive }) =>
            `block px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
              isActive
                ? "bg-blue-600 text-white shadow"
                : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
            }`
          }
        >
          Histórico de Pedidos
        </NavLink>

        <NavLink
          to="/admin/suppliers"
          end
          className={({ isActive }) =>
            `block px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
              isActive
                ? "bg-blue-600 text-white shadow"
                : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
            }`
          }
        >
          Listar Fornecedores
        </NavLink>
      </nav>
    </aside>
  );
};
