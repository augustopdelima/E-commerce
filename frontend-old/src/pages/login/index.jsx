import { useRef } from "react";
import "./index.css"; 
import { useAuth } from "../../context/auth/auth_helpers";
import { useNavigate } from "react-router";

export default function Login() {
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    
    login(email, password).then((res) => {
      if(res?.data.accessToken) {
        navigate("/")
      }    
    });
    
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              ref={emailRef}
              placeholder="Digite seu email"
              required
            />
          </div>

          <div className="form-group">
            <label>Senha</label>
            <input
              type="password"
              ref={passwordRef}
              placeholder="Digite sua senha"
              required
            />
          </div>

          <button type="submit" className="btn-login">
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}