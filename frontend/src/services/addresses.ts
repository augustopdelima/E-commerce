import { api } from "./api";
import type  { AddressResponse, Address } from "../types";


export const addressService = {

    async getAll(userId:string)  {
        const res = await api.get<AddressResponse[]>(`/address/users/${userId}/addresses`);
        return res.data;
    },

    async create(userId:string, addressData:Address) {
        const res = await api.post(`/address/users/${userId}/addresses`,addressData);
        return res.data;
    },

    async remove(userId:string, addressId:string) {
        const res = await api.delete(`/address/users/${userId}/addresses/${addressId}`);
        return res.data;
    },
}