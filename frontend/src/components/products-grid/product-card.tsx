import type { FC } from "react";
import type { ProductResponse } from "../../services/products";
import { Link } from "react-router";
import { useAuth } from "../../context/auth";
import { useCart } from "../../context/cart";

interface ProductCardProps {
    product:ProductResponse
}

export const  ProductCard:FC<ProductCardProps>  = ({  product  }) => {

    const { user } = useAuth();
    const { addToCart } = useCart();

    const price = Number(product.price).toFixed(2);
    const stock = Number(product.stock);
    
    const hasStock = stock > 0;

    function handleAddToCart() {
        if(user?.type === "client") return;
        addToCart({ ...product, quantity:1  });
    }

    return(
        <div>
            <h3>{product.name}</h3>
            <img src={product.imageUrl  || "http://localhost:3000/uploads/placeholder"} alt={product.name} />
            <p>{product.description}</p>
            <p>R$ {price}</p>
            <p>Estoque: {product.stock}</p>
            <Link  to={`/products/${stock}`}>
                Ver detalhes
            </Link>
            <button onClick={handleAddToCart}  disabled={!hasStock}>
                {hasStock ? "Adicionar ao carrinho" : "Indisponível" }
            </button>
        </div>
    )
};
