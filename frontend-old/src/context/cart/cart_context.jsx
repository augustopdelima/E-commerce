import { useState } from "react";

import { CartContext } from "./cart_hook";

/**
 * Provedor do Carrinho
 * Gerencia os itens do carrinho e fornece métodos para manipulá-los.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @returns {JSX.Element}
 */
export function CartProvider({ children }) {
  /**
   * @typedef {Object} Product
   * @property {number} id
   * @property {string} name
   * @property {number} price
   * @property {string} image
   * @property {number} stock
   * @property {number} [quantity] - quantidade no carrinho
   */

  /** @type {[Product[], Function]} */
  const [cartItems, setCartItems] = useState([]);

  /**
   * Adiciona um produto ao carrinho.
   * @param {{
   *   id: number,
   *  name: string,
   *  price: number,
   * image: string
   * stock: number
   * }} product - Produto a ser adicionado.
   */
  const addToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find((p) => p.id === product.id);
      let updated;
      if (existing) {
        updated = prev.map((p) =>
          p.id === product.id ? { ...p, quantity: (p.quantity || 1) + 1 } : p
        );
      } else {
        updated = [...prev, { ...product, quantity: 1 }];
      }
      return updated;
    });
  };

  /**
   * Remove um item do carrinho (reduz quantidade ou remove completamente)
   * @param {number} productId
   */
  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((p) => p.id !== productId));
  };

  /**
   * Atualiza a quantidade de um item no carrinho.
   * Se a quantidade for menor ou igual a zero, o item é removido.
   * @param {number} productId
   * @param {number} quantity
   */
  const updateQuantity = (productId, quantity) => {
    setCartItems((prev) => {
      if (quantity <= 0) {
        return prev.filter((p) => p.id !== productId);
      }
      return prev.map((p) => (p.id === productId ? { ...p, quantity } : p));
    });
  };

  /**
   * Limpa todo o carrinho.
   */
  const clearCart = () => {
    setCartItems([]);
  };

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * (item.quantity || 1),
    0
  );

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
        clearCart,
        totalItems,
        totalPrice,
        updateQuantity
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
