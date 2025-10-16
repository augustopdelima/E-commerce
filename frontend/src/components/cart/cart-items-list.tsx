import { useCart } from "../../context/cart/cart_hook";
import type { ProductCart } from "../../types";

export function CartItemsList() {
  const { cartItems, updateQuantity, removeFromCart } = useCart();

  const handleIncreaseQuantity = (item: ProductCart) => {
    const incrementQuantity = item.quantity + 1;
    updateQuantity(item.id, incrementQuantity);
  }

  const handleDecreaseQuantity = (item: ProductCart) => {
    const decrementQuantity = item.quantity - 1;
    updateQuantity(item.id, decrementQuantity);
  }

  return (
    <ul className="cart-items">
      {cartItems.map((item) => (
        <li key={item.id} >
          <img src={item.imageUrl} alt={item.name}  />
          <div >
            <h4>{item.name}</h4>
            <p >R$ {item.price.toFixed(2)}</p>
            <div>
              <button onClick={() => handleDecreaseQuantity(item)}>-</button>
              <span>{item.quantity}</span>
              <button onClick={() => handleIncreaseQuantity(item)}>+</button>
            </div>
            <button onClick={() => removeFromCart(item.id)}>Remover</button>
          </div>
        </li>
      ))}
    </ul>
  );
}