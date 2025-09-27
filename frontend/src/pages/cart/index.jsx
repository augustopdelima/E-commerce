import { useCart } from "../../context/cart/cart_hook";
import "./index.css";

export default function CartPage() {
  const {
    cartItems,
    removeFromCart,
    clearCart,
    totalPrice,
    updateQuantity,
    totalItems,
  } = useCart();

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
            <button className="checkout-btn">Finalizar compra</button>
            <button className="clear-btn" onClick={clearCart}>
              Esvaziar carrinho
            </button>
          </aside>
        </div>
      )}
    </div>
  );
}
