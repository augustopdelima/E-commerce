import { api } from "./api";

export interface CartItemAPI {
  id: number;
  userId: number;
  productId: number;
  quantity: number;
  product?: {
    id: number;
    name: string;
    price: number;
    imageUrl: string;
    stock: number;
  };
}

export const cartService = {
  async getCart(): Promise<CartItemAPI[]> {
    const res = await api.get<CartItemAPI[]>("/cart");
    return res.data;
  },

  async addToCart(productId: number, quantity: number = 1): Promise<CartItemAPI> {
    const res = await api.post<CartItemAPI>("/cart", {
      productId,
      quantity,
    });
    return res.data;
  },

  async updateCartItem(productId: number, quantity: number): Promise<CartItemAPI> {
    const res = await api.put<CartItemAPI>(`/cart/${productId}`, {
      quantity,
    });
    return res.data;
  },

  async removeFromCart(productId: number): Promise<void> {
    await api.delete(`/cart/${productId}`);
  },

  async clearCart(): Promise<void> {
    await api.delete("/cart");
  },
};
