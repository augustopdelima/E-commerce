import React, { useState } from "react";
import { CartContext } from "./cart_hook";
import type { ProductCart } from "../../types";

interface CartProviderProps {
  children: React.ReactNode;
}

/** Provider que gerencia o estado do carrinho */
export function CartProvider({ children }: CartProviderProps) {
  const [cartItems, setCartItems] = useState<ProductCart[]>([]);

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
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
