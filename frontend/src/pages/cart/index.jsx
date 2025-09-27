import { useCart } from "../../context/cart/cart_hook";
import { useAuth } from "../../context/auth/auth_helpers";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { addressService } from "../../services/addresses";
import "./index.css";

/**
 * Página do carrinho com seleção de endereço
 * @param {Object} props
 * @param {number} props.userId - ID do usuário logado
 */
export default function CartPage() {
  const {
    cartItems,
    removeFromCart,
    clearCart,
    totalPrice,
    updateQuantity,
    totalItems,
  } = useCart();

  const { user } = useAuth();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const data = await addressService.getAll(user.id);
        setAddresses(data);

        if (data.length > 0) {
          setSelectedAddress(data[0].id); // seleciona o primeiro por padrão
        }
      } catch (err) {
        console.error("Erro ao carregar endereços:", err);
        setMessage("Erro ao carregar endereços.");
      }
    };

    fetchAddresses();
  }, [user]);

  return (
    <div className="cart-container">
      <h2 className="cart-title">Seu Carrinho</h2>

      {cartItems.length === 0 ? (
        <p className="empty">Carrinho vazio</p>
      ) : (
        <div className="cart-content">
          <ul className="cart-items">
            {cartItems.map((item) => (
              <li key={item.id} className="cart-item">
                <img src={item.imageUrl} alt={item.name} className="cart-img" />
                <div className="cart-info">
                  <h4>{item.name}</h4>
                  <p className="price">R$ {item.price.toFixed(2)}</p>

                  <div className="quantity-controls">
                    <button
                      className="qty-btn"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      className="qty-btn"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>

                  <button
                    className="remove-btn"
                    onClick={() => removeFromCart(item.id)}
                  >
                    Remover item
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <aside className="cart-summary">
            <h3>Resumo</h3>
            <p>
              Subtotal ({totalItems} itens):{" "}
              <strong>R$ {totalPrice.toFixed(2)}</strong>
            </p>
            <button className="checkout-btn" disabled={!selectedAddress}>
              Finalizar compra
            </button>
            <button className="clear-btn" onClick={clearCart}>
              Esvaziar carrinho
            </button>

            {addresses.length === 0 ? (
              <p className="no-address">
                Nenhum endereço cadastrado.{" "}
                <Link to="/user/address/register" className="register-link">
                  Cadastre um endereço
                </Link>
              </p>
            ) : (
              <div className="address-section">
                <h3>Selecione o endereço de entrega:</h3>
                <select
                  className="address-select"
                  value={selectedAddress || ""}
                  onChange={(e) => setSelectedAddress(Number(e.target.value))}
                >
                  {addresses.map((addr) => (
                    <option key={addr.id} value={addr.id}>
                      {addr.street}, {addr.number} - {addr.city}/{addr.state}
                    </option>
                  ))}
                </select>
              </div>
            )}


          </aside>
        </div>
      )}

      {message && <p className="message">{message}</p>}
    </div>
  );
}
