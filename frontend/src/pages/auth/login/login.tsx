import { useRef } from "react";
import { useAuth } from "../../../context/auth";
import { useNavigate } from "react-router";

export const Login = () => {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const { login, isLoggingIn, loginError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (
    event
  ) => {
    event.preventDefault();

    if (!emailRef.current || !passwordRef.current) return;

    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    const data = await login(email, password);
    if (data.accessToken) navigate("/");
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-gray-100 p-4">
      <section className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              ref={emailRef}
              placeholder="Digite seu email"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Senha
            </label>
            <input
              id="password"
              type="password"
              ref={passwordRef}
              placeholder="Digite sua senha"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {isLoggingIn && (
            <p className="text-center text-blue-600 font-medium animate-pulse">
              Autenticando...
            </p>
          )}

          {loginError && (
            <p className="text-center text-red-500">
              {"Credenciais inválidas."}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoggingIn}
            className={`w-full py-3 cursor-pointer font-semibold rounded-lg shadow-md transition duration-150 ease-in-out transform ${
              isLoggingIn
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white hover:scale-[1.01]"
            }`}
          >
            {isLoggingIn ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </section>
    </div>
  );
};
