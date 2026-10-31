import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const SECRET_KEY = process.env.TOKEN_ENCRYPTION_KEY || "default_repurposeone_secret_32bytes_len!";
// Ensure key is 32 bytes
const KEY = crypto.createHash("sha256").update(String(SECRET_KEY)).digest();

export interface EncryptedData {
  encrypted: string;
  iv: string;
  authTag: string;
}

export function encryptToken(text: string): string {
  if (!text) return "";
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  const authTag = cipher.getAuthTag().toString("hex");

  return JSON.stringify({
    encrypted,
    iv: iv.toString("hex"),
    authTag,
  });
}

export function decryptToken(cipherJson: string): string {
  if (!cipherJson) return "";
  try {
    const { encrypted, iv, authTag } = JSON.parse(cipherJson);
    const decipher = crypto.createDecipheriv(ALGORITHM, KEY, Buffer.from(iv, "hex"));
    decipher.setAuthTag(Buffer.from(authTag, "hex"));
    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  } catch (err) {
    console.error("Token decryption failed:", err);
    return "";
  }
}
