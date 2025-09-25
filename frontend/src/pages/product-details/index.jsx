import { useEffect,  useState } from "react";
import { productService } from "../../services/products";
import { useParams } from "react-router";
import "./index.css"; 

export default function ProductDetails() {

   const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const res = await productService.getProductById(id);
        setProduct(res);
      } catch (err) {
        if (err.response?.status === 404) {
          setError("Produto não encontrado.");
        } else {
          setError("Erro ao carregar produto.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  if (loading) return <p className="loading">Carregando detalhes do produto...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="product-details">
      <div className="product-info">
        <h2 className="product-name">{product.name}</h2>
        <p className="product-description">{product.description}</p>
        <p className="product-price">Preço: R$ {product.price.toFixed(2)}</p>
        <p className="product-stock">Quantidade: {product.stock}</p>
        <button className="add-to-cart-btn" disabled={product.stock === 0}>
          {product.stock > 0 ? "Adicionar ao carrinho" : "Esgotado"}
        </button>
      </div>
    </div>
  );
}
