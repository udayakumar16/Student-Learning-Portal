import dotenv from "dotenv";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars robustly across different working directories.
// With npm workspaces, the process CWD can be the repo root, which would
// otherwise miss backend/.env and cause the backend to exit immediately.
const candidateEnvPaths = [
  path.resolve(process.cwd(), ".env"),
  path.resolve(process.cwd(), "backend", ".env"),
  // src/config -> backend/.env
  path.resolve(__dirname, "..", "..", ".env"),
  // dist/config -> backend/.env (after build)
  path.resolve(__dirname, "..", "..", "..", ".env")
];

const envPath = candidateEnvPaths.find((p) => fs.existsSync(p));
dotenv.config(envPath ? { path: envPath } : undefined);

const required = (key: string) => {
  const value = process.env[key];
  if (!value) throw new Error(`Missing env var: ${key}`);
  return value;
};

export const env = {
  PORT: Number(process.env.PORT ?? 5000),
  MONGODB_URI: required("MONGODB_URI"),
  JWT_SECRET: required("JWT_SECRET"),
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN ?? "7d",
  CORS_ORIGIN: process.env.CORS_ORIGIN ?? "http://localhost:3000",

  // Optional: if set, backend can bootstrap an admin account on startup.
  ADMIN_EMAIL: process.env.ADMIN_EMAIL,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
  ADMIN_NAME: process.env.ADMIN_NAME,

  // Optional (recommended): protect admin self-signup.
  // If set, /api/admin/register requires this key.
  ADMIN_SETUP_KEY: process.env.ADMIN_SETUP_KEY
};
