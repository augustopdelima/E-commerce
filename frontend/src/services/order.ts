import { api } from "./api";

import type { Order, ItemsOrder  } from "../types";

export const orderService = {
    async createOrder(userId:string, items:ItemsOrder[],  token:string)  {
        const res = await api.post(
            "/order",
            { userId, items },
            {
                headers:{
                    Authorization: `Bearer ${token}`,
                }
            }
        );

        return res.data;
    },

    async getOrdersByUser(userId:string, token:string) {
        const res = await api.get<Order[]>(`/order/${userId}`, {
            headers:{
                Authorization:`Bearer ${token}`,
            }
        });
        return res.data;
    },

    async getOrders(token:string, userId:string) {
        const res = await api.get<Order[]>("/order", {
            headers:{
                Authorization:`Bearer ${token}`,
                userid:userId
            }
        });

        return res.data;
    }
};