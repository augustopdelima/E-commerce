import { useNavigate, useParams } from "react-router";
import { useAuth } from "../../../context/auth";
import { UpdateProductForm } from "../../../components/update-products/update-product-form";

export const UpdateProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user, accessToken } = useAuth();

  if (!user || !accessToken) {
    return (
      <section className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-2xl shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Acesso negado</h2>
        <p className="text-gray-600 mb-6">
          Você precisa estar logado para atualizar produtos.
        </p>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          onClick={() => navigate("/login")}
        >
          Ir para login
        </button>
      </section>
    );
  }

  if (!id) {
    return (
      <section className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-2xl shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          ID do produto não encontrado
        </h2>
        <p className="text-gray-600 mb-6">
          Não foi possível identificar o produto a ser atualizado.
        </p>
        <button
          className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          onClick={() => navigate("/products")}
        >
          Voltar
        </button>
      </section>
    );
  }

  return (
    <UpdateProductForm id={id} accessToken={accessToken} userId={user.id} /> 
  );
};
