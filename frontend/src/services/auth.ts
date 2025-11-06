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

export function setupInterceptors({ getAccessToken, refresh, logout }: SetupInterceptorsParams) {
  api.interceptors.request.use((config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        
        const storedRefresh = localStorage.getItem("refreshToken");
        if (!storedRefresh) {
          await logout();
          return Promise.reject(error);
        }

        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch(err => Promise.reject(err));
        }

        isRefreshing = true;

        return refresh()
          .then((newTokens) => {
            const newAccess = newTokens.accessToken;
            processQueue(null, newAccess);
            originalRequest.headers.Authorization = `Bearer ${newAccess}`;
            return api(originalRequest);
          })
          .catch(async (err) => {
            processQueue(err, null);
            await logout();
            return Promise.reject(err);
          })
          .finally(() => {
            isRefreshing = false;
          });
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
