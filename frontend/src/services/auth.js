import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

export const authService = {
  async login(email, password) {
    const res = await api.post("/user/login", { email, password });
    return res;
  },
  async logout() {
    await api.post("/user/logout");
  },
  async refreshToken() {
    try {
      const res = await api.post("/user/refresh");
      return res;
    } catch (err) {
      console.error("Erro ao renovar token", err);
      return null;
    }
  },
};
