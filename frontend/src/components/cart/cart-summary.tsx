import { useState, type JSX } from "react";
import { useMutation } from "@tanstack/react-query";
import { orderService } from "../../services/order";
import { useAuth } from "../../context/auth";
import { useCart, type ModalType } from "../../context/cart/cart_hook";
import { AddressSelector } from "./address-selector";
import type { Order } from "../../types";


interface CartSummaryProps {
  userId: string;
  totalItems: number;
  totalPrice: number;
  onClearCart: () => void;
  onShowModal: (message: string, type:ModalType) => void;
}

export const CartSummary = ({
  userId,
  totalItems,
  totalPrice,
  onClearCart,
  onShowModal,
}: CartSummaryProps): JSX.Element => {
  const { accessToken } = useAuth();
  const { cartItems } = useCart();
  const [selectedAddress, setSelectedAddress] = useState<number | null>(null);
  

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
      onShowModal(`Pedido #${order.id} criado com sucesso!`, "success");
      onClearCart();
    },
    onError: () => {
      onShowModal("Erro ao finalizar pedido.", "error");
    },
  });

  return (
    <aside className="bg-white shadow-md rounded-2xl p-6 w-full sm:w-80 flex-shrink-0 space-y-4">
      <h3 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-2">
        Resumo
      </h3>

      <p className="text-gray-700">
        Subtotal ({totalItems} itens):{" "}
        <span className="text-blue-600 font-bold">R$ {totalPrice.toFixed(2)}</span>
      </p>

      
      <button
        className="w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={() => checkoutMutation.mutate()}
        disabled={!selectedAddress || checkoutMutation.isPending}
      >
        {checkoutMutation.isPending ? "Processando..." : "Finalizar compra"}
      </button>

      
      <button
        className="w-full py-2 px-4 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition"
        onClick={onClearCart}
      >
        Esvaziar carrinho
      </button>

     
      <div className="mt-4">
        <AddressSelector
          userId={userId}
          selected={selectedAddress}
          onSelect={setSelectedAddress}
        />
      </div>

    </aside>
  );
};
