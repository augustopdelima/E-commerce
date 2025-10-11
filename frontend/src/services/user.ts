import { api } from "../services/api";

export interface UserUpdate {
    name:string,
    email:string,
    password:string,
};

export const userService = {
  async getUserById(userId: string, accessToken: string) {
    const res = await api.get(`/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return res.data;
  },

  async updateUser(userId:string, userData:UserUpdate, accessToken:string) {
    const res = await api.put(`/user/${userId}`,userData, {
        headers:{
            Authorization:`Bearer ${accessToken}`,
        },
    });

    return res.data;
  }
};
