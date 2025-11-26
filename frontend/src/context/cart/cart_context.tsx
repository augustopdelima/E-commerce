import React, { useState, useCallback, useEffect } from "react";
import { CartContext, type ModalType } from "./cart_hook";
import type { ProductCart } from "../../types";
import { useAuth } from "../auth";
import { cartService } from "../../services/cart";

interface CartProviderProps {
  children: React.ReactNode;
}



/** Provider que gerencia o estado do carrinho */
export function CartProvider({ children }: CartProviderProps) {
  const { user, isAuthenticated } = useAuth();
  const [cartItems, setCartItems] = useState<ProductCart[]>([]);
  const [modalMessage, setModalMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [modalType, setModalType] = useState<ModalType>("success");

  // Carrega carrinho do backend quando usuário loga
  useEffect(() => {
    if (isAuthenticated && user) {
      loadCartFromBackend();
    } else {
      setCartItems([]);
    }
  }, [isAuthenticated, user]);

  const loadCartFromBackend = async () => {
    try {
      setIsLoading(true);
      const items = await cartService.getCart();
      const formattedItems: ProductCart[] = items.map((item) => ({
        id: item.product!.id,
        name: item.product!.name,
        price: item.product!.price,
        imageUrl: item.product!.imageUrl,
        stock: item.product!.stock,
        quantity: item.quantity,
      }));
      setCartItems(formattedItems);
    } catch (error) {
      console.error("Erro ao carregar carrinho:", error);
    } finally {
      setIsLoading(false);
    }
  };

  /** Adiciona um produto ao carrinho */
  const addToCart = async (product: ProductCart) => {
    if (!isAuthenticated) {
      showModal("Faça login para adicionar itens ao carrinho", "error");
      return;
    }

    try {
      await cartService.addToCart(product.id, 1);
      
      setCartItems((prev) => {
        const existing = prev.find((p) => p.id === product.id);
        if (existing) {
          return prev.map((p) =>
            p.id === product.id ? { ...p, quantity: (p.quantity || 1) + 1 } : p
          );
        }
        return [...prev, { ...product, quantity: 1 }];
      });
      showModal("Produto adicionado ao carrinho!", "success");
    } catch (error: any) {
      showModal(error.response?.data?.error || "Erro ao adicionar ao carrinho", "error");
    }
  };

  /** Remove um item do carrinho */
  const removeFromCart = async (productId: number) => {
    if (!isAuthenticated) return;

    try {
      await cartService.removeFromCart(productId);
      setCartItems((prev) => prev.filter((p) => p.id !== productId));
    } catch (error) {
      console.error("Erro ao remover item:", error);
    }
  };

  /** Atualiza a quantidade de um item */
  const updateQuantity = async (
    productId: number,
    quantity: number,
    stock: number
  ) => {
    if (!isAuthenticated) return;

    try {
      if (quantity <= 0) {
        await removeFromCart(productId);
        return;
      }

      // Garante que a quantidade não ultrapasse o estoque
      const newQuantity = Math.min(quantity, stock);

      await cartService.updateCartItem(productId, newQuantity);

      setCartItems((prev) =>
        prev.map((p) =>
          p.id === productId ? { ...p, quantity: newQuantity } : p
        )
      );
    } catch (error: any) {
      showModal(error.response?.data?.error || "Erro ao atualizar quantidade", "error");
    }
  };
  
  /** Limpa o carrinho */
  const clearCart = async () => {
    if (!isAuthenticated) return;

    try {
      await cartService.clearCart();
      setCartItems([]);
    } catch (error) {
      console.error("Erro ao limpar carrinho:", error);
    }
  };

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
