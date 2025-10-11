import { api } from "./api";

interface Address {
    street:string;
    number:number;
    city: string;
    state:string;
    zipcode: string;
}


export const addressService = {

    async getAll(userId:string)  {
        const res = await api.get(`/address/users/${userId}addresses`);
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