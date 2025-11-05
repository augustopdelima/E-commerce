import { NavLink } from "react-router";

export const UserSidebar = () => {
  return (
    <aside className="bg-white border-r border-gray-200 shadow-sm p-6">
      <nav className="flex flex-col space-y-3">
        <NavLink
          to="/user"
          end
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
          to="/user/update"
          className={({ isActive }) =>
            `block px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
              isActive
                ? "bg-blue-600 text-white shadow"
                : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
            }`
          }
        >
          Alterar Dados
        </NavLink>

        <NavLink
          to="/user/address"
          className={({ isActive }) =>
            `block px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
              isActive
                ? "bg-blue-600 text-white shadow"
                : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
            }`
          }
        >
          Cadastrar Endereço
        </NavLink>
      </nav>
    </aside>
  );
};
