import "./index.css"; // CSS separado
import { Link } from "react-router";
/**
 * Componente para exibir um card de produto
 * @param {Object} props
 * @param {Object} props.product - Objeto produto com id, name, description, price e stock
 */

const ProductCard = ({ product }) => {
  return (
    <div className="product-card">
      <h3 className="product-name">{product.name}</h3>
      <p className="product-description">{product.description}</p>
      <p className="product-price">R$ {product.price.toFixed(2)}</p>
      <p className="product-stock">Estoque: {product.stock}</p>
      <Link to={"/products/" + product.id} className="product-link">
        Ver detalhes
      </Link>
      <button className="btn-add-cart" disabled={product.stock === 0}>
        {product.stock > 0 ? "Adicionar ao carrinho" : "Indisponível"}
      </button>
    </div>
  );
};

export default ProductCard;
