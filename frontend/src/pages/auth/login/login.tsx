import { useRef } from "react";
import { useAuth } from "../../../context/auth";
import { useNavigate } from "react-router";

export const Login = () => {
  const emailRef: React.Ref<HTMLInputElement> = useRef(null);
  const passwordRef: React.Ref<HTMLInputElement> = useRef(null);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    if (!emailRef.current) return;
    if (!passwordRef.current) return;

    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    login(email, password).then((data) => {
      if (data.accessToken) {
        navigate("/");
      }
    });
  };

  return (
    <div>
      <section>
        <h2>Login</h2>

        <form onSubmit={handleSubmit}>
          <div>
            <label>Email</label>
            <input
              type="email"
              ref={emailRef}
              placeholder="Digite seu email"
              required
            />
          </div>

          <div>
            <label>Senha</label>
            <input
              type="password"
              ref={passwordRef}
              placeholder="Digite sua senha"
              required
            />
          </div>

          <button type="submit">Entrar</button>
        </form>
      </section>
    </div>
  );
};
