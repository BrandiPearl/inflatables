export const CMS_COOKIE = "cms_session";
export const CMS_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

async function sha256Hex(value: string): Promise<string> {
  const data = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export async function expectedSessionToken(): Promise<string | null> {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return null;
  return sha256Hex(`wonderland-cms:${password}`);
}

export async function isValidSession(token: string | undefined): Promise<boolean> {
  const expected = await expectedSessionToken();
  if (!expected || !token) return false;
  return token === expected;
}
