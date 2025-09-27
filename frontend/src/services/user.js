import{ api } from "../services/api";

export const userService = {
  getUserById,
  updateUser,
};

async function getUserById(userId, accessToken) {
  try {
    const response = await api.get(`/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    throw error;
  }
}

async function updateUser(userId, userData, accessToken) {
  try {
    const response = await api.put(`/user/${userId}`, userData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    throw error;
  }
}