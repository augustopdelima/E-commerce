import { useEffect, useCallback, useState } from "react";
import type { ReactNode, FC } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "./auth_hook";
import { authService, setupInterceptors } from "../../services/auth";
import type {
  User,
  LoginResponse,
  RegisterResponse,
  RefreshResponse,
} from "../../types";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { data: user, isLoading: loadingUser } = useQuery<User | null>({
    queryKey: ["auth", "user"],
    queryFn: () => {
      const stored = localStorage.getItem("user");
      return stored && stored !== "undefined" && stored !== "null"
        ? JSON.parse(stored)
        : null;
    },
    staleTime: Infinity,
  });

  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");
  const isAuthenticated = !!user && !!accessToken;

  const loginMutation = useMutation<
    LoginResponse,
    Error,
    { email: string; password: string }
  >({
    mutationFn: ({ email, password }) => authService.login(email, password),
    onSuccess: (data) => {
      const { user: u, accessToken: at, refreshToken: rt } = data;
      localStorage.setItem("user", JSON.stringify(u));
      localStorage.setItem("accessToken", at);
      localStorage.setItem("refreshToken", rt);
      queryClient.setQueryData(["auth", "user"], u);
    },
  });

  const login = useCallback(
    (email: string, password: string) =>
      loginMutation.mutateAsync({ email, password }),
    [loginMutation]
  );


  const registerMutation = useMutation<
    RegisterResponse,
    Error,
    { name: string; email: string; password: string }
  >({
    mutationFn: ({ name, email, password }) =>
      authService.register(name, email, password),
    onSuccess: (data) => {
      const { user: u, accessToken: at, refreshToken: rt } = data;
      localStorage.setItem("user", JSON.stringify(u));
      localStorage.setItem("accessToken", at);
      localStorage.setItem("refreshToken", rt);
      queryClient.setQueryData(["auth", "user"], u);
    },
  });

  const register = useCallback(
    (name: string, email: string, password: string) =>
      registerMutation.mutateAsync({ name, email, password }),
    [registerMutation]
  );
  
  const logout = useCallback(async () => {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    queryClient.setQueryData(["auth", "user"], null);
  }, [queryClient]);

  const refresh = useCallback(async (): Promise<RefreshResponse> => {
    const storedRefresh = localStorage.getItem("refreshToken");
    if (!storedRefresh) {
      await logout();
      throw new Error("No refresh token available");
    }

    setIsRefreshing(true);
    try {
      const newTokens = await authService.refreshToken(storedRefresh);
      localStorage.setItem("accessToken", newTokens.accessToken);
      localStorage.setItem("refreshToken", newTokens.refreshToken);
      return newTokens;
    } catch (err) {
      await logout();
      throw err;
    } finally {
      setIsRefreshing(false);
    }
  }, [logout]);

  useEffect(() => {
    const cleanup = setupInterceptors({
      getAccessToken: () => localStorage.getItem("accessToken"),
      refresh,
      logout,
    }) as (() => void) | undefined;
    return () => cleanup?.();
  }, [refresh, logout]);

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        accessToken,
        refreshToken,
        isAuthenticated,
        isRefreshing,
        loadingUser,
        login,
        register,
        logout,
        refresh,
        isLoggingIn: loginMutation.isPending,
        loginError: loginMutation.error,
        isRegistering: registerMutation.isPending,
        registerError: registerMutation.error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
