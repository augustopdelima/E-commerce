import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { userService } from "../../../services/user";
import { useAuth } from "../../../context/auth/auth_helpers";
import "./index.css";

export default function UpdateUser() {
  const navigate = useNavigate();
  const { accessToken, user, logout } = useAuth();

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserData() {
      try {
        setUserData({
          name: user.name,
          email: user.email,
          password: "", // Não preenche a senha por segurança
        });
        setLoading(false);
      } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error);
        alert("Erro ao carregar os dados do usuário.");
        logout();
        navigate("/login");
      }
    }

    fetchUserData();
  }, [user, accessToken, navigate, logout]);

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);

    const updatedData = {
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
    };

    userService
      .updateUser(user.id, updatedData, accessToken)
      .then(() => {
        alert("Dados atualizados com sucesso!");
        navigate("/user");
      })
      .catch(() => {
        alert("Erro ao atualizar os dados. Tente novamente.");
      });
  }

  if (loading) return <p>Carregando...</p>;

  return (
    <div className="update-user-container">
      <h1>Atualizar Dados do Usuário</h1>
      <form className="update-user-form" onSubmit={handleSubmit}>
        <label>
          Nome:
          <input
            type="text"
            name="name"
            value={userData.name}
            onChange={(e) =>
              setUserData((prev) => ({ ...prev, name: e.target.value }))
            }
            required
          />
        </label>

        <label>
          Email:
          <input
            type="email"
            name="email"
            value={userData.email}
            onChange={(e) =>
              setUserData((prev) => ({ ...prev, email: e.target.value }))
            }
            required
          />
        </label>

        <label>
          Nova Senha:
          <input
            type="password"
            name="password"
            minLength={8}
            onChange={(e) =>
              setUserData((prev) => ({ ...prev, password: e.target.value }))
            }
          />
        </label>

        <button type="submit">Salvar Alterações</button>
      </form>
    </div>
  );
}