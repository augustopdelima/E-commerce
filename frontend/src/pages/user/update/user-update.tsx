import { useNavigate } from "react-router";
import { useAuth } from "../../../context/auth";
import { useEffect, useState, type FormEventHandler } from "react";
import { userService } from "../../../services/user";

export const UserUpdate = () => {
  const navigate = useNavigate();
  const { accessToken, user, logout } = useAuth();

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    if (!user) return;

    try {
      setUserData({
        name: user.name,
        email: user.email,
        password: "",
      });
    } catch (error) {
      console.error("Erro ao buscar dados!", error);
      alert("Erro ao carregar os dados do usuário.");
      logout();
      navigate("/login");
    }
  }, [user, accessToken, navigate, logout]);

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    if (!user) return;

    if (!accessToken) return;

    userService
      .updateUser(user.id, userData, accessToken)
      .then(() => {
        alert("Dados atualizados com sucesso!");
        navigate("/user");
      })
      .catch(() => {
        alert("Erro ao atualizar os dados. Tente novamente.");
      });
  };

  return (
    <div className="max-w-2xl mx-auto p-6 md:p-10">
      <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 md:p-10">
        <h1 className="text-3xl font-semibold text-gray-800 mb-8 pb-4 border-b border-gray-200">
          Atualizar Dados do Usuário
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nome */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome
            </label>
            <input
              type="text"
              name="name"
              value={userData.name}
              required
              onChange={(e) =>
                setUserData((prev) => ({ ...prev, name: e.target.value }))
              }
              className="block w-full rounded-xl border border-gray-300 bg-gray-50 focus:bg-white shadow-sm px-4 py-2.5 text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={userData.email}
              required
              onChange={(e) =>
                setUserData((prev) => ({ ...prev, email: e.target.value }))
              }
              className="block w-full rounded-xl border border-gray-300 bg-gray-50 focus:bg-white shadow-sm px-4 py-2.5 text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
            />
          </div>

          {/* Nova senha */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nova senha
            </label>
            <input
              type="password"
              name="password"
              value={userData.password}
              placeholder="Deixe em branco para não alterar"
              onChange={(e) =>
                setUserData((prev) => ({ ...prev, password: e.target.value }))
              }
              className="block w-full rounded-xl border border-gray-300 bg-gray-50 focus:bg-white shadow-sm px-4 py-2.5 text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
            />
          </div>

          {/* Botão de ação */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-semibold shadow-md hover:bg-blue-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
            >
              Salvar alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
