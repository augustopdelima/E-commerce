import { api } from "./api"; 
import type{ Supplier, SupplierFormInput } from "../types/supplier";

export const supplierService = {
  
  getAll: async (accessToken: string, userId: string): Promise<Supplier[]> => {
    const res = await api.get("/suppliers", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        userid: userId,
      },
    });
    return res.data;
  },

 
  getById: async (id: string, accessToken: string, userId: string): Promise<Supplier> => {
    const res = await api.get(`/suppliers/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        userid: userId,
      },
    });
    return res.data;
  },

  
  create: async (
    formData: SupplierFormInput,
    accessToken: string,
    userId: string
  ): Promise<Supplier> => {
    const res = await api.post("/suppliers", formData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        userid: userId,
      },
    });
    return res.data;
  },

  
  update: async (
    id: string,
    formData: SupplierFormInput,
    accessToken: string,
    userId: string
  ): Promise<Supplier> => {
    const res = await api.put(`/suppliers/${id}`, formData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        userid: userId,
      },
    });
    return res.data;
  },

  
  deactivate: async (id: string, accessToken: string, userId: string): Promise<void> => {
    await api.patch(`/suppliers/${id}/deactivate`, null, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        userid: userId,
      },
    });
  },
};
