import { api } from "./api";
import type { ProductForm, ProductResponse } from "../types";

export const productService = {
    async getAllProducts() {
        const res = await api.get<ProductResponse[]>("/product");
        return res.data;
    },

    async getProductById(id: string) {
        const res = await api.get<ProductResponse>(`/product/${id}`);
        return res.data;
    },

    async createProduct(productData: ProductForm, accessToken: string, userId: string) {
        const formData = new FormData();

        formData.append("name", productData.name);
        formData.append("description", productData.description);
        formData.append("price", productData.price);
        formData.append("stock", productData.stock);

        
        if (productData.supplierId) {
            formData.append("supplierId", productData.supplierId);
        }

        if (productData.image) {
            formData.append("image", productData.image);
        }

        const res = await api.post("/product/register", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${accessToken}`,
                userid: userId,
            },
        });

        return res.data;
    },

    async updateProduct(id: string, productData: ProductForm, accessToken: string, userId: string) {
        const formData = new FormData();

        formData.append("name", productData.name);
        formData.append("description", productData.description);
        formData.append("price", productData.price);
        formData.append("stock", productData.stock);

        
        if (productData.supplierId) {
            formData.append("supplierId", productData.supplierId);
        }

        if (productData.image) {
            formData.append("image", productData.image);
        }

        const res = await api.put(`/product/${id}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${accessToken}`,
                userid: userId,
            },
        });

        return res.data;
    },

    
    async deleteProduct(id: string, accessToken: string, userId: string) {
        const res = await api.put(`/product/delete/${id}`, null, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                userid: userId,
            },
        });

        return res.data;
    },
};
