import type { User } from "./user";

export interface SetupInterceptorsParams {
  getAccessToken: () => string | null;
  refresh: () => Promise<RefreshResponse>;
  logout: () => Promise<void> | void;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface RegisterResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  message: string;
}

export interface RefreshResponse {
  accessToken:string,
  refreshToken:string,
}

