import { useState, useEffect } from "react";
import { authService } from "../../services/auth";
import { AuthContext } from "./auth_helpers";
 
/**
 * Provedor de autenticação responsável por gerenciar
 * o estado do usuário, tokens de acesso e atualização.
 *
 * @component
 * @param {Object} props - Propriedades do componente.
 * @param {React.ReactNode} props.children - Elementos filhos que terão acesso ao contexto.
 * @returns {JSX.Element} Contexto de autenticação com métodos e estados.
 */
export const AuthProvider = ({ children }) => {
  4;
  /** @type {[Object|null, Function]} Usuário autenticado ou `null` */
  const [user, setUser] = useState(null);

  /** @type {[string|null, Function]} Token de acesso ou `null` */
  const [accessToken, setAccessToken] = useState(null);

  /** @type {[string|null, Function]} Token de atualização ou `null` */
  const [refreshToken, setRefreshToken] = useState(null);

  /** @type {boolean} Indica se há um usuário autenticado */
  const isAuthenticated = !!accessToken && !!user;

  /** @type {[boolean, Function]} Indica se ainda está carregando do storage */
  const [loadingUser, setLoadingUser] = useState(true);

  /**
   * Carrega o estado de autenticação do armazenamento local ao montar o componente.
   */

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

  /**
   * Realiza o login do usuário e armazena os tokens.
   *
   * @async
   * @param {string} email - Email do usuário.
   * @param {string} password - Senha do usuário.
   * @returns {Promise<Object>} Resposta do serviço de autenticação com `accessToken`, `user` e `refreshToken`.
   */
  const login = async (email, password) => {
    const res = await authService.login(email, password);
    console.log(res);
    if (res?.data.accessToken && res?.data.user) {
      setAccessToken(res.data.accessToken);
      setUser(res.data.user);
      setRefreshToken(res.data.refreshToken);
      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("refreshToken", res.data.refreshToken);
    }

    return res;
  };

  /**
   * Realiza o logout do usuário, limpando tokens e estado.
   *
   * @async
   * @returns {Promise<void>}
   */
  const logout = async () => { 
    setAccessToken(null);
    setUser(null);
    setRefreshToken(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    localStorage.removeItem("refreshToken");
  };

  /**
   * Atualiza o token de acesso do usuário.
   *
   * @async
   * @returns {Promise<void>}
   */
  const refresh = async () => {
    const newToken = await authService.refreshToken();
    if (newToken.data.accessToken) {
      setAccessToken(newToken.data.accessToken);
      setRefreshToken(newToken.data.refreshToken);
      localStorage.setItem("accessToken", newToken);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        refreshToken,
        login,
        logout,
        refresh,
        isAuthenticated,
        loadingUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
