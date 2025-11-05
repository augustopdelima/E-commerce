import { createContext, useContext } from "react";

import type { ProductCart } from "../../types";

interface CartContextType {
  cartItems: ProductCart[];
  addToCart: (product: ProductCart) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number, stock:number) => void;
  clearCart: () => void;
  totalPrice: number;
  totalItems: number;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart deve ser usado dentro de um CartProvider");
  }
  return context;
}