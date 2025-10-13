import { useRef } from "react";
import { useAuth } from "../../../context/auth";
import { useNavigate } from "react-router";

export const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const nameRef:React.Ref<HTMLInputElement> = useRef(null);
  const emailRef:React.Ref<HTMLInputElement> = useRef(null);
  const passwordRef:React.Ref<HTMLInputElement> = useRef(null);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    if(!nameRef.current) return;
    if(!emailRef.current) return;
    if(!passwordRef.current) return;

    const name = nameRef.current.value;
    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    register(name, email, password).then((data) => {
      if(data.accessToken){
        navigate("/");
      }  
    }).catch((err) => {
        console.log("Registration error:", err);
        alert("Erro ao cadastrar usuário. Tente novamente.");
    });
    
  };

  return (
    <div>
      <section>
        <h2>Cadastro de usuário</h2>

        <form onSubmit={handleSubmit}>
          <div>
            <label>Nome</label>
            <input
              type="text"
              name="name"
              ref={nameRef}
              placeholder="Digite seu nome"
              required
            />
          </div>

          <div>
            <label>Email</label>
            <input
              type="email"
              name="email"
              ref={emailRef}
              placeholder="Digite seu email"
              required
            />
          </div>

          <div>
            <label>Senha</label>
            <input
              type="password"
              name="password"
              ref={passwordRef}
              placeholder="Digite sua senha"
              minLength={8}
              required
            />
          </div>

          <button type="submit">
            Cadastrar
          </button>
        </form>
      </section>
    </div>
  );
};
