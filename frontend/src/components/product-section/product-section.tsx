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
    <section
      className="container mx-auto p-4 md:p-8  
               grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12"
    >
      <div className="md:order-1">
        <Thumb {...data} />
      </div>

      <div className="md:order-2 space-y-8">
       
        <div className="bg-white p-6 rounded-lg shadow-md border-b border-gray-200">
          <Info hasStockText={hasStockText} {...data} />
        </div>

      
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-4 text-gray-800">
            Opções de Compra
          </h3>
          <Actions
            hasStock={hasStock}
            price={data.price}
            addToCartHandler={addToCartHandler}
            sendText={sendText}
            addToCartText={addToCartText}
          />
        </div>
      </div>
    </section>
  );
};
