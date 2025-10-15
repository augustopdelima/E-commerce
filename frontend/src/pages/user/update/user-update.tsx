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

    if(!accessToken) return;

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
    <div>
      <h1>Atualizar Dados do Usuário</h1>

      <form onSubmit={handleSubmit}>
        <label>
          Nome:
          <input
            type="text"
            name="name"
            value={userData.name}
            required
            onChange={(e) =>
              setUserData((prev) => ({ ...prev, name: e.target.value }))
            }
          />
        </label>

       

        <label>
          Email:
          <input
            type="email"
            name="email"
            value={userData.email}
            required
            onChange={(e) =>
              setUserData((prev) => ({ ...prev, email: e.target.value }))
            }
          />
        </label>

        

        <label>
          Nova senha:
          <input
            type="password"
            name="password"
            value={userData.password}
            placeholder="Deixe em branco para não alterar"
            onChange={(e) =>
              setUserData((prev) => ({ ...prev, password: e.target.value }))
            }
          />
        </label>

       

        <button type="submit">Salvar alterações</button>
      </form>
    </div>
  );
};
