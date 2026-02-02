import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { HttpError } from "../utils/http.js";

export type UserRole = "student" | "admin";
export type AuthRequest = Request & { userId?: string; userRole?: UserRole };

export function requireAuth(req: AuthRequest, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice("Bearer ".length) : undefined;

  if (!token) return next(new HttpError(401, "Missing Authorization token"));

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as { userId: string; role?: UserRole };
    req.userId = payload.userId;
    req.userRole = payload.role;
    next();
  } catch {
    next(new HttpError(401, "Invalid or expired token"));
  }
}

export function requireAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  requireAuth(req, res, (err) => {
    if (err) return next(err);
    if (req.userRole !== "admin") return next(new HttpError(403, "Admin access required"));
    return next();
  });
}
