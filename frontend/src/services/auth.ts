import { api } from "./api";
import type {
  LoginResponse,
  RegisterResponse,
  RefreshResponse,
  SetupInterceptorsParams,
} from "../types";

export function setupInterceptors({
  getAccessToken,
  refresh,
  logout,
}: SetupInterceptorsParams) {
  // Request interceptor → adiciona token automaticamente
  api.interceptors.request.use((config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  //Response interceptor → tenta renovar token se der 401
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const newToken = await refresh();
          if (newToken.accessToken) {
            originalRequest.headers.Authorization = `Bearer ${newToken.accessToken}`;
            return api(originalRequest); // refaz a request original
          }
        } catch (err) {
          console.error("Falha ao renovar token:", err);
        }

        await logout(); // se refresh falhar, força logout
      }

      return Promise.reject(error);
    }
  );
}

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const res = await api.post<LoginResponse>("/user/login", {
      email,
      password,
    });
    return res.data; // 🔹 Retorna apenas os dados úteis
  },

  async register(
    name: string,
    email: string,
    password: string
  ): Promise<RegisterResponse> {
    const res = await api.post<RegisterResponse>("/user/register", {
      name,
      email,
      password,
    });
    return res.data;
  },

  async refreshToken(): Promise<RefreshResponse> {
    const res = await api.post("/user/refresh");
    return res.data;
  },
};
