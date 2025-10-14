import type { FC } from "react";
import { Thumb } from "./product-thumb";
import { Actions } from "./product-actions";
import { Info } from "./product-info";
import { productService } from "../../services/products";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useCart } from "../../context/cart";

interface ProductSectionProps {
  id: string;
}

export const ProductSection: FC<ProductSectionProps> = ({ id }) => {
  const { addToCart } = useCart();

  const { data } = useSuspenseQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      return productService.getProductById(id);
    },
  });

  const addToCartHandler = () => {
    if (!data) return;
    addToCart({ ...data, quantity: 1 });
  };

  const hasStock = data!.stock > 0;
  const hasStockText = hasStock ? `Em estoque (${data?.stock}) ` : "Esgotado";
  const addToCartText = hasStock ? "Adicionar ao carrinho" : "Esgotado";
  const sendText = hasStock ? "Pronto para envio" : "Indisponível";

  return (
    <section>
      <Thumb {...data} />
      <Info  hasStockText={hasStockText} {...data} />
      <Actions
        hasStock={hasStock}
        price={data.price}
        addToCartHandler={addToCartHandler}
        sendText={sendText}
        addToCartText={addToCartText}
      />
    </section>
  );
};
