import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { env } from "../config/env.js";
import { UserModel } from "../models/User.js";
import { asyncHandler, HttpError } from "../utils/http.js";

export const authRouter = Router();

const registerSchema = z.object({
  name: z.string().min(2),
  registerNumber: z.string().min(2),
  department: z.string().min(2),
  email: z.string().email(),
  mobile: z.string().min(7),
  password: z.string().min(6)
});

authRouter.post(
  "/register",
  asyncHandler(async (req, res) => {
    const input = registerSchema.parse(req.body);

    const existing = await UserModel.findOne({
      $or: [{ email: input.email.toLowerCase() }, { registerNumber: input.registerNumber }]
    });

    if (existing) throw new HttpError(409, "Email or Register Number already exists");

    const hashed = await bcrypt.hash(input.password, 10);

    const user = await UserModel.create({
      ...input,
      email: input.email.toLowerCase(),
      password: hashed,
      role: "student"
    });

    const token = jwt.sign({ userId: String(user._id), role: user.role ?? "student" }, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN as any
    });

    res.status(201).json({
      token,
      user: {
        id: String(user._id),
        name: user.name,
        registerNumber: user.registerNumber,
        department: user.department,
        email: user.email,
        mobile: user.mobile,
        collegeName: user.collegeName,
        role: user.role ?? "student",
        createdAt: user.createdAt
      }
    });
  })
);

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

authRouter.post(
  "/login",
  asyncHandler(async (req, res) => {
    const input = loginSchema.parse(req.body);

    const user = await UserModel.findOne({ email: input.email.toLowerCase() });
    if (!user) throw new HttpError(401, "Invalid email or password");

    const ok = await bcrypt.compare(input.password, user.password);
    if (!ok) throw new HttpError(401, "Invalid email or password");

    const token = jwt.sign({ userId: String(user._id), role: user.role ?? "student" }, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN as any
    });

    res.json({
      token,
      user: {
        id: String(user._id),
        name: user.name,
        registerNumber: user.registerNumber,
        department: user.department,
        email: user.email,
        mobile: user.mobile,
        collegeName: user.collegeName,
        role: user.role ?? "student",
        createdAt: user.createdAt
      }
    });
  })
);
