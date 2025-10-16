import { useState, type JSX } from "react";
import { useMutation } from "@tanstack/react-query";
import { orderService } from "../../services/order";
import { useAuth } from "../../context/auth";
import { useCart } from "../../context/cart/cart_hook";
import { AddressSelector } from "./address-selector";
import type { Order } from "../../types";

interface CartSummaryProps {
  userId: string;
  totalItems: number;
  totalPrice: number;
  onClearCart: () => void;
}

export const CartSummary = ({
  userId,
  totalItems,
  totalPrice,
  onClearCart,
}: CartSummaryProps): JSX.Element => {
  const { accessToken } = useAuth();
  const { cartItems } = useCart();
  const [selectedAddress, setSelectedAddress] = useState<number | null>(null);
  const [message, setMessage] = useState<string>("");

  const checkoutMutation = useMutation({
    mutationFn: async () => {
      const items = cartItems.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
      }));

      if (!accessToken) return;

      return await orderService.createOrder(userId, items, accessToken);
    },
    onSuccess: (order: Order) => {
      setMessage(`Pedido #${order.id} criado com sucesso!`);
      onClearCart();
    },
    onError: () => {
      setMessage("Erro ao finalizar pedido.");
    },
  });

  return (
    <aside className="cart-summary">
      <h3>Resumo</h3>
      <p>
        Subtotal ({totalItems} itens):{" "}
        <strong>R$ {totalPrice.toFixed(2)}</strong>
      </p>

      <button
        className="checkout-btn"
        onClick={() => checkoutMutation.mutate()}
        disabled={!selectedAddress || checkoutMutation.isPending}
      >
        {checkoutMutation.isPending ? "Processando..." : "Finalizar compra"}
      </button>

      <button className="clear-btn" onClick={onClearCart}>
        Esvaziar carrinho
      </button>

      <AddressSelector
        userId={userId}
        selected={selectedAddress}
        onSelect={setSelectedAddress}
      />

      {message && <p className="message">{message}</p>}
    </aside>
  );
};
