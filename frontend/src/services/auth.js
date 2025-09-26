import { api } from "./api.js";

export const authService = {
  async login(email, password) {
    const res = await api.post("/user/login", { email, password });
    return res;
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

export function setupInterceptors({ accessToken, refresh, logout }) {
  // Adiciona o token a cada request
  api.interceptors.request.use((config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  });

  // Se der 401, tenta o refresh
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const newToken = await refresh();
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest); // refaz a request original
        } catch (err) {
          await logout(); // refresh falhou → desloga
          return Promise.reject(err);
        }
      }
      return Promise.reject(error);
    }
  );
}