import React, { useState, useCallback } from "react";
import { CartContext, type ModalType } from "./cart_hook";
import type { ProductCart } from "../../types";

interface CartProviderProps {
  children: React.ReactNode;
}



/** Provider que gerencia o estado do carrinho */
export function CartProvider({ children }: CartProviderProps) {
  const [cartItems, setCartItems] = useState<ProductCart[]>([]);
  const [modalMessage, setModalMessage] = useState<string | null>(null);
  

  const [modalType, setModalType] = useState<ModalType>("success");

  /** Adiciona um produto ao carrinho */
  const addToCart = (product: ProductCart) => {
    setCartItems((prev) => {
      const existing = prev.find((p) => p.id === product.id);
      if (existing) {
        return prev.map((p) =>
          p.id === product.id ? { ...p, quantity: (p.quantity || 1) + 1 } : p
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  /** Remove um item do carrinho */
  const removeFromCart = (productId: number) => {
    setCartItems((prev) => prev.filter((p) => p.id !== productId));
  };

  /** Atualiza a quantidade de um item */
  const updateQuantity = (
    productId: number,
    quantity: number,
    stock: number
  ) => {
    setCartItems((prev) => {
      if (quantity <= 0) {
        return prev.filter((p) => p.id !== productId);
      }

      // Garante que a quantidade não ultrapasse o estoque
      const newQuantity = Math.min(quantity, stock);

      return prev.map((p) =>
        p.id === productId ? { ...p, quantity: newQuantity } : p
      );
    });
  };
  /** Limpa o carrinho */
  const clearCart = () => setCartItems([]);

  /** Calcula o total do carrinho */
  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * (item.quantity || 1),
    0
  );

  /** Calcula o total de itens */
  const totalItems = cartItems.reduce(
    (acc, item) => acc + (item.quantity || 1),
    0
  );

  const showModal = useCallback((message: string, type: ModalType = "success") => {
    setModalMessage(message);
    setModalType(type);
    setTimeout(() => setModalMessage(null), 3000);
  }, []);
 
  const hideModal = () => setModalMessage(null);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalPrice,
        totalItems,
        showModal,
        hideModal,
        modalMessage,
        modalType,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
