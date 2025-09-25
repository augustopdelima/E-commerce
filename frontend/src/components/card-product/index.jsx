import "./index.css"; // CSS separado
import { Link } from "react-router";

/**
 * Componente para exibir um card de produto.
 *
 * @component
 * @param {Object} props
 * @param {Object} props.product - Objeto do produto.
 * @param {number|string} props.product.id - ID do produto.
 * @param {string} props.product.imageUrl - URL da imagem do produto.
 * @param {string} props.product.name - Nome do produto.
 * @param {string} props.product.description - Descrição do produto.
 * @param {number} props.product.price - Preço do produto.
 * @param {number} props.product.stock - Quantidade em estoque.
 * @returns {JSX.Element} Card do produto.
 */

const ProductCard = ({ product }) => {
  return (
    <div className="product-card">
      <h3 className="product-name">{product.name}</h3>
      <img
        src={product.imageUrl || "http://localhost:3000/uploads/placeholder.png"}
        alt={product.name}
        className="product-image"
      />
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
