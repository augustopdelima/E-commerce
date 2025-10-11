import { useEffect, useState } from "react";
import { productService } from "../../services/products";
import { useParams } from "react-router";
import { useCart } from "../../context/cart/cart_hook";
import "./index.css";

export default function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();


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

  function addToCartHandler() {
    addToCart({ ...product, quantity: 1 });
  }

  if (loading)
    return <p className="loading">Carregando detalhes do produto...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
     <div className="product-page">
      {/* Coluna esquerda - imagens */}
      <div className="product-images">
        <img src={product.imageUrl} alt={product.name} className="main-image" />
        <div className="thumbnail-list">
          <img src={product.imageUrl} alt="thumb" className="thumbnail" />
        </div>
      </div>

      {/* Coluna central - detalhes */}
      <div className="product-info">
        <h1 className="product-title">{product.name}</h1>
        <p className="product-description">{product.description}</p>
        <p className="product-price">R$ {product.price.toFixed(2)}</p>
        <p className={`product-stock ${product.stock > 0 ? "in-stock" : "out-stock"}`}>
          {product.stock > 0 ? `Em estoque (${product.stock})` : "Esgotado"}
        </p>
      </div>

      {/* Coluna direita - caixa de compra */}
      <div className="purchase-box">
        <p className="price-box">R$ {product.price.toFixed(2)}</p>
        <p className="stock-box">{product.stock > 0 ? "Pronto para envio" : "Indisponível"}</p>

        <button className="buy-btn" onClick={addToCartHandler} disabled={product.stock === 0}>

          {product.stock > 0 ? "Adicionar ao carrinho" : "Esgotado"}
        </button>
      </div>
    </div>
  );
}
