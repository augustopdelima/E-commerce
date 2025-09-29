/**
 * Recebe o header Cookie e retorna um objeto com os cookies
 * @param cookieHeader string | undefined, valor de req.headers.cookie
 * @returns Record<string, string> com cookies
 */
export function parseCookies(cookieHeader?: string): Record<string, string> {
  const cookies: Record<string, string> = {};
  if (!cookieHeader) return cookies;

  cookieHeader.split(";").forEach((cookie) => {
    const [name, ...rest] = cookie.trim().split("="); // divide "chave=valor"
    const value = rest.join("="); // garante que "=" dentro do valor seja preservado
    cookies[name] = decodeURIComponent(value); // decodifica valores URL encoded
  });

  return cookies;
}