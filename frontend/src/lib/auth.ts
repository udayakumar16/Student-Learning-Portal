export function getTokenFromCookie(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|; )token=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : null;
}

export function setTokenCookie(token: string) {
  if (typeof document === "undefined") return;
  document.cookie = `token=${encodeURIComponent(token)}; Path=/; Max-Age=${60 * 60 * 24 * 7}`;
}

export function clearTokenCookie() {
  if (typeof document === "undefined") return;
  document.cookie = "token=; Path=/; Max-Age=0";
}
