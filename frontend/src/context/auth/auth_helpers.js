import { createContext, useContext } from "react";
/**
 * Contexto de autenticação que armazena informações do usuário,
 * tokens e funções relacionadas à autenticação.
 *
 * @type {import("react").Context<{
 *  user: Object|null,
 *  accessToken: string|null,
 *  refreshToken: string|null,
 *  isAuthenticated: boolean,
 *  login: (email: string, password: string) => Promise<Object>,
 *  logout: () => Promise<void>,
 *  refresh: () => Promise<void>
 * }|null>}
 */
export const AuthContext = createContext(null);

/**
 * Hook personalizado para acessar o contexto de autenticação.
 *
 * @returns {{
 *  user: Object|null,
 *  accessToken: string|null,
 *  refreshToken: string|null,
 *  isAuthenticated: boolean,
 *  login: (email: string, password: string) => Promise<Object>,
 *  logout: () => Promise<void>,
 *  refresh: () => Promise<void>
 * }} Retorna o contexto de autenticação ou `null` se não estiver dentro de um `AuthProvider`.
 */
export const useAuth = () => {
  return useContext(AuthContext);
};