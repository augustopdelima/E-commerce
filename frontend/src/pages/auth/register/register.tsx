import { useRef } from "react";
import { useAuth } from "../../../context/auth";
import { useNavigate } from "react-router";

export const Register = () => {
  const { register, registerError, isRegistering } = useAuth();
  const navigate = useNavigate();

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (!nameRef.current || !emailRef.current || !passwordRef.current) return;

    const name = nameRef.current.value;
    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    const data = await register(name, email, password);
    if (data?.accessToken) navigate("/");
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-gray-100 p-4">
      <section className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
          Cadastro de Usuário
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Nome
            </label>
            <input
              id="name"
              type="text"
              ref={nameRef}
              placeholder="Digite seu nome"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 transition duration-150 ease-in-out placeholder-gray-500"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              ref={emailRef}
              placeholder="Digite seu email"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 transition duration-150 ease-in-out placeholder-gray-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Senha
            </label>
            <input
              id="password"
              type="password"
              ref={passwordRef}
              placeholder="Digite sua senha (mínimo 8 caracteres)"
              minLength={8}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 transition duration-150 ease-in-out placeholder-gray-500"
            />
          </div>
 
          {registerError && (
            <p className="text-red-600 text-sm font-medium">
              { "Erro ao cadastrar usuário."}
            </p>
          )}

          <button
            type="submit"
            disabled={isRegistering}
            className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50 transition duration-150 ease-in-out transform hover:scale-[1.01] disabled:opacity-60"
          >
            {isRegistering? "Cadastrando..." : "Cadastrar"}
          </button>
        </form>
      </section>
    </div>
  );
};
