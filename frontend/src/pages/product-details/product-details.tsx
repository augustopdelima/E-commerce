import { useParams } from "react-router";
import { productService } from "../../services/products";
import { useQuery } from "@tanstack/react-query";
import { useCart } from "../../context/cart";

export const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCart();

  const { data, isLoading, error } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      if (!id) {
        throw error;
      }

      return productService.getProductById(id);
    },
  });

  const addToCartHandler = () => {
    if (!data) return;
    addToCart({ ...data, quantity: 1 });
  };

  if (isLoading) return <p>Carregando detalhes do produto...</p>;

  if (error) return <p>Erro ao carregar o produto!</p>;

  const hasStock = data!.stock > 0;
  const hasStockText = hasStock ? `Em estoque (${data?.stock}) ` : "Esgotado";
  const addToCartText = hasStock ? "Adicionar ao carrinho" : "Esgotado";
  const sendText = hasStock ? "Pronto para envio" : "Indisponível";

  return (
    <section>
      <aside>
        <img src={data?.imageUrl} alt={data?.name} />
        <div>
          <img src={data?.imageUrl} alt="thumb" />
        </div>
      </aside>

      <main>
        <h1>{data?.name}</h1>
        <p>{data?.description}</p>
        <p>{data?.price.toFixed(2)}</p>
        <p>{hasStockText}</p>
      </main>

      <div>
        <p>R$ {data?.price.toFixed(2)}</p>
        <p>{sendText}</p>
        <button onClick={addToCartHandler} disabled={!hasStock}>
          {addToCartText}
        </button>
      </div>
    </section>
  );
};
