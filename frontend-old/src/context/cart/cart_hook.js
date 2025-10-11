import { createContext, useContext } from "react";
/**
 * Contexto do Carrinho
 * @type {React.Context}
 */
export const CartContext = createContext();

/**
 * Hook para acessar o carrinho facilmente.
 * @returns {{
 *      cartItems: Array,
 *      addToCart: Function,
 *      removeFromCart: Function,
 *      clearCart: Function,
 *      totalItems: number,
 *      totalPrice: number,
 *      updateQuantity: Function
 * }} Dados e métodos do carrinho.
 */
export function useCart() {
  return useContext(CartContext);
}
