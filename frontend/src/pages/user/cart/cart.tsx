import { useAuth } from "../../../context/auth";
import { useCart } from "../../../context/cart";
import { CartItemsList, CartSummary } from "../../../components/cart";

export const CartPage = () => {
  const { user, accessToken } = useAuth();
  const { cartItems, totalItems, totalPrice, clearCart } = useCart();

  if (!cartItems.length) return <p>Carrinho vazio</p>;
  if (!user || !accessToken) return <p>Usuário não autenticado</p>;

  return (
    <section>
      <h2>Seu Carrinho</h2>

      <div>
        <CartItemsList />
        <CartSummary
          userId={user.id}
          totalItems={totalItems}
          totalPrice={totalPrice}
          onClearCart={clearCart}
        />
      </div>
    </section>
  );
};
