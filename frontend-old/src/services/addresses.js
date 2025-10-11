import { api } from "./api.js";

export const addressService = {
  /**
   * Lista todos os endereços de um usuário
   * GET /users/:userId/addresses
   */
  async getAll(userId) {
    const res = await api.get(`/address/users/${userId}/addresses`);
    return res.data;
  },

  /**
   * Cadastra um novo endereço para um usuário
   * POST /users/:userId/addresses
   */
  async create(userId, addressData) {
    const res = await api.post(`/address/users/${userId}/addresses`, {
      street: addressData.street,
      number: addressData.number,
      city: addressData.city,
      state: addressData.state,
      zipcode: addressData.zipcode,
    });
    return res.data;
  },

  /**
   * Exclui um endereço de um usuário
   * DELETE /users/:userId/addresses/:addressId
   */
  async remove(userId, addressId) {
    const res = await api.delete(`/address/users/${userId}/addresses/${addressId}`);
    return res.data;
  },
};
