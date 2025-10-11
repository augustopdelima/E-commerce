import {
  useState,
  useEffect,
  useCallback,
} from "react";
import type { ReactNode, FC } from "react";
import { authService, setupInterceptors } from "../../services/auth";
import { AuthContext } from "./auth_hook";

import type { User } from "../../types";


interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [loadingUser, setLoadingUser] = useState<boolean>(true);

  const isAuthenticated = !!accessToken && !!user;

  // Carrega usuário e tokens do localStorage

  const getAccessToken = useCallback(() => {
    return accessToken;
  },[accessToken])

  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    const storedUser = localStorage.getItem("user");
    const storedRefreshToken = localStorage.getItem("refreshToken");

    if (
      storedToken &&
      storedUser &&
      storedUser !== "undefined" &&
      storedUser !== "null"
    ) {
      setAccessToken(storedToken);
      setUser(JSON.parse(storedUser));
      setRefreshToken(storedRefreshToken);
    }
    setLoadingUser(false);
  }, []);

  const register = async (name: string, email: string, password: string) => {
    const data = await authService.register(name, email, password);

    if (data.accessToken && data.user) {
      setAccessToken(data.accessToken);
      setUser(data.user);
      setRefreshToken(data.refreshToken);
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("refreshToken", data.refreshToken);
    }
    return data;
  };

  const login = async (email: string, password: string) => {
    const data = await authService.login(email, password);
    if (data.accessToken && data.user) {
      setAccessToken(data.accessToken);
      setUser(data.user);
      setRefreshToken(data.refreshToken);
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("refreshToken", data.refreshToken);
    }
    return data;
  };

  const logout = useCallback(async () => {
    setAccessToken(null);
    setUser(null);
    setRefreshToken(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    localStorage.removeItem("refreshToken");
  }, []);

  const refresh = useCallback(async () => {
    const newTokens = await authService.refreshToken();
    if (newTokens.accessToken) {
      setAccessToken(newTokens.accessToken);
      setRefreshToken(newTokens.refreshToken);
      localStorage.setItem("accessToken", newTokens.accessToken);
      localStorage.setItem("refreshToken", newTokens.refreshToken);
    }

    return newTokens;
  }, []);

  // Configura interceptors sempre que o token mudar
  useEffect(() => {
    setupInterceptors({ getAccessToken, refresh, logout });
  }, [getAccessToken, refresh, logout]);

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        refreshToken,
        isAuthenticated,
        loadingUser,
        login,
        register,
        logout,
        refresh,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
