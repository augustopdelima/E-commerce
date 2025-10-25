import type { FC } from "react";
import type { ProductResponse } from "../../types";
import { Link } from "react-router";
import { useAuth } from "../../context/auth";
import { useCart } from "../../context/cart";

interface ProductCardProps {
  product: ProductResponse;
}

export const ProductCard: FC<ProductCardProps> = ({ product }) => {
  const { user } = useAuth();
  const { addToCart } = useCart();

  const price = Number(product.price).toFixed(2);
  const stock = Number(product.stock);

  const hasStock = stock > 0;

  function handleAddToCart() {
    if (user?.type === "client") return;
    addToCart({ ...product, quantity: 1 });
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 p-4 flex flex-col items-center text-center">
      
      <h3 className="text-lg font-semibold text-text-dark mb-2">
        {product.name}
      </h3>

     
      <img
        src={product.imageUrl || "http://localhost:3000/uploads/placeholder"}
        alt={product.name}
        className="w-full h-48 object-cover rounded-lg mb-3"
      />

      
      <p className="text-sm text-gray-600 mb-2 line-clamp-3">
        {product.description}
      </p>

     
      <p className="text-lg font-semibold text-primary mb-1">R$ {price}</p>

     
      <p
        className={`text-sm mb-3 ${
          product.stock > 0 ? "text-green-600" : "text-red-600"
        }`}
      >
        Estoque: {product.stock}
      </p>

   
      <div className="flex flex-col gap-2 w-full">
        <Link
          to={`/products/${product.id}`}
          className="text-primary font-medium hover:text-primary-dark underline"
        >
          Ver detalhes
        </Link>

        <button
          onClick={handleAddToCart}
          disabled={!hasStock}
          className="w-full py-2 rounded-md font-medium text-white transition-colors cursor-pointer duration-200 bg-blue-500 hover:bg-blue-600"
        >
          {hasStock ? "Adicionar ao carrinho" : "Indisponível"}
        </button>
      </div>
    </div>
  );
};
