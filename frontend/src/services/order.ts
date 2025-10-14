import { api } from "./api";

import type { Order } from "../types";

export const orderService = {
    async createOrder(userId:string, items:[],  token:string)  {
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

    async getOrdersByUser(userId:string) {
        const res = await api.get<Order[]>(`/order/${userId}`);
        return res.data;
    },

    async getOrders(token:string) {
        const res = await api.get("/order", {
            headers:{
                Authorization:`Bearer ${token}`,
            }
        });

        return res.data;
    }
};