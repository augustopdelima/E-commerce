import { api } from "./api";

export const orderService = {
  async createOrder(userId, items, token) {
    const res = await api.post(
      "/order",
      { userId, items }, 
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  },

  async getOrdersByUser(userId)  {
    const res = await api.get(`/order/${userId}`);
    return res.data;
  },
  async getOrders(token) {
    const res = await api.get("/order", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  },
};
