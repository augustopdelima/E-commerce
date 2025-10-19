import { useNavigate, useParams } from "react-router";
import { useAuth } from "../../../context/auth";
import { UpdateProductForm } from "../../../components/update-products/update-product-form";

export const UpdateProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user, accessToken } = useAuth();

  if (!user || !accessToken) {
    return (
      <section>
        <h2>Acesso negado</h2>
        <p>Você precisa estar logado para atualizar produtos.</p>
        <button onClick={() => navigate("/login")}>Ir para login</button>
      </section>
    );
  }

  if (!id) {
    return (
      <section>
        <h2>ID do produto não encontrado</h2>
        <p>Não foi possível identificar o produto a ser atualizado.</p>
        <button onClick={() => navigate("/admin")}>Voltar</button>
      </section>
    );
  }

  return <UpdateProductForm id={id} accessToken={accessToken} userId={user.id} />;
};
