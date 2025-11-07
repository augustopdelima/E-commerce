import { createContext, useContext } from "react";

import type { User, RefreshResponse, LoginResponse, RegisterResponse } from "../../types";



export interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isRefreshing:boolean;
  loadingUser: boolean;
  login: (email: string, password: string) => Promise<LoginResponse>;
  register: (name: string, email: string, password: string) => Promise<RegisterResponse>;
  logout: () => Promise<void>;
  refresh: () => Promise<RefreshResponse>;
  isLoggingIn:boolean,
  loginError?: Error | null,
  isRegistering?: boolean;
  registerError?: Error | null;
}


export const AuthContext = createContext<AuthContextType | undefined>(undefined);


export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};
