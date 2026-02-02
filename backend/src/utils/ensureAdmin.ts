import bcrypt from "bcryptjs";
import { env } from "../config/env.js";
import { UserModel } from "../models/User.js";

function adminRegisterNumber(email: string) {
  // Deterministic, unique-ish, and safe for the registerNumber field.
  const hex = Buffer.from(email).toString("hex").slice(0, 12);
  return `ADMIN-${hex}`;
}

export async function ensureAdminUser() {
  if (!env.ADMIN_EMAIL || !env.ADMIN_PASSWORD) return;

  const email = env.ADMIN_EMAIL.toLowerCase();
  const name = env.ADMIN_NAME ?? "Admin";

  const existing = await UserModel.findOne({ email });
  if (existing) {
    if (existing.role !== "admin") {
      existing.role = "admin";
      await existing.save();
    }
    return;
  }

  const hashed = await bcrypt.hash(env.ADMIN_PASSWORD, 10);

  await UserModel.create({
    name,
    registerNumber: adminRegisterNumber(email),
    department: "Administration",
    email,
    mobile: "0000000000",
    password: hashed,
    role: "admin",
    collegeName: "Admin"
  });
}
