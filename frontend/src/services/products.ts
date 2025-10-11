import { api } from "./api";

export interface Product {
    name:string;
    description:string;
    price:string;
    stock:string;
    image: File;
}

export const productService = {
    async getAllProducts()  {
        const res = await api.get("/product");
        return res.data;
    },

    async getProductById(id:string){
        const res = await api.get(`/product/${id}`);
        return res.data;
    },

    async createProduct(productData:Product) {
        const formData =  new FormData();

        formData.append("name", productData.name);
        formData.append("description", productData.description);
        formData.append("price", productData.price);
        formData.append("stock", productData.stock);

        if(productData.image) {
            formData.append("image", productData.image);
        }

        const res = await api.post("/product/register", formData, {
            headers: {"Content-type":"multipart/form-data"},
        });

        return res;
    },

    async updateProduct(id:string, productData:Product, accessToken:string, userId:string) {
        const formData = new FormData();

        formData.append("name", productData.name);
        formData.append("description", productData.description);
        formData.append("price", productData.price);
        formData.append("stock", productData.stock);

        if(productData.image) {
            formData.append("image", productData.image);
        }

        const res = await api.put(`/product/${id}`, formData,{
            headers:{
                "Content-Type":"multipart/form-data",
                Authorization:`Bearer ${accessToken}`,
                userid:userId,
            }
        });

        return res.data;
    },

    async deleteProduct(id:string,accessToken:string, userId:string) {
        const res = await api.delete(`/product/${id}`, {
            headers:{
                Authorization:`Bearer ${accessToken}`,
                userid: userId
            }
        });

        return res;
    },
};