import { api } from "./api";
import type {
  LoginResponse,
  RegisterResponse,
  RefreshResponse,
  SetupInterceptorsParams,
} from "../types";


let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });
  failedQueue = [];
};

export function setupInterceptors({
  getAccessToken,
  refresh,
  logout,
}: SetupInterceptorsParams) {
  // Request interceptor - adds token automatically
  api.interceptors.request.use((config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // Response interceptor - handles token refresh
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          try {
            const token = await new Promise((resolve, reject) => {
              failedQueue.push({ resolve, reject });
            });
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          } catch (err) {
            return Promise.reject(err);
          }
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const newToken = await refresh();
          if (newToken.accessToken) {
            originalRequest.headers.Authorization = `Bearer ${newToken.accessToken}`;
            processQueue(null, newToken.accessToken);
            return api(originalRequest);
          }
        } catch (err) {
          processQueue(new Error('Failed to refresh token'));
          console.error("Failed to refresh token:", err);
          await logout();
        } finally {
          isRefreshing = false;
        }
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
    return res.data; 
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

  async refreshToken(refreshToken: string): Promise<RefreshResponse> {
    const res = await api.post("/user/refresh", {
      refreshToken,
    });
    return res.data;
  },
};
