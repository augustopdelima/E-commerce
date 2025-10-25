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
    <div className="flex items-center justify-center min-h-screen w-full bg-gray-100 p-4 overflow-hidden">
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out placeholder-gray-500"
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out placeholder-gray-500"
            />
          </div>

         
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out transform hover:scale-[1.01]"
          >
            Entrar
          </button>
        </form>
      </section>
    </div>
  );
};
