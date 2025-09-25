import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true,
});

export const productService = {
  async getAllProducts() {
    const res = await api.get('/product');
    return res.data;
  },
  async getProductById(id) {
    const res = await api.get(`/product/${id}`);
    return res.data;
  },
  async createProduct(productData) {
    const res = await api.post('/product/register', productData);
    return res;
  },
  async updateProduct(id, productData) {
    const res = await api.put(`/product/${id}`, productData);
    return res.data;
  },
  async deleteProduct(id) {
    await api.delete(`/product/${id}`);
  },
};