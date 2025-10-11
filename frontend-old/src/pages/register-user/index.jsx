import "./index.css";
import { useAuth } from "../../context/auth/auth_helpers";
import { useNavigate } from "react-router";

export default function RegisterUser() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const name = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    register(name, email, password).then((res) => {
      if (res?.data.accessToken) {
        navigate("/");
      }
    }).catch((err) => {
      console.error("Registration error:", err);
      alert("Erro ao cadastrar usuário. Tente novamente.");
    });
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h2>Cadastro de usuário</h2>

        <form className="register-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nome</label>
            <input
              type="text"
              name="name"
              placeholder="Digite seu nome"
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Digite seu email"
              required
            />
          </div>

          <div className="form-group">
            <label>Senha</label>
            <input
              type="password"
              name="password"
              placeholder="Digite sua senha"
              length="8"
              required
            />
          </div>

          <button type="submit" className="btn-register">
            Cadastrar
          </button>
        </form>
      </div>
    </div>
  );
}
