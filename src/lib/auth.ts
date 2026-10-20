import crypto from "crypto";

export const SESSION_COOKIE = "gota_session";

export function hashPassword(password: string) {
  const salt = "gota-salt-v2";
  return crypto.createHash("sha256").update(salt + password).digest("hex");
}

export function verifyPassword(password: string, hash: string) {
  return hashPassword(password) === hash;
}

export function createSessionToken(payload: { email: string; name: string; role: string }) {
  const json = JSON.stringify({ ...payload, exp: Date.now() + 1000 * 60 * 60 * 24 * 7 });
  return Buffer.from(json).toString("base64url");
}

export function verifySessionToken(token: string): { email: string; name: string; role: string } | null {
  try {
    const json = Buffer.from(token, "base64url").toString("utf-8");
    const data = JSON.parse(json);
    if (data.exp < Date.now()) return null;
    return data;
  } catch {
    return null;
  }
}

// Default single login credentials
export const DEFAULT_LOGIN = {
  email: "tourisme@gotainternational.com",
  password: "Gota2026!",
  name: "GOTA Admin",
  role: "administrator",
};
