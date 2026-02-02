import { Router } from "express";
import { z } from "zod";
import { requireAuth, type AuthRequest } from "../middleware/auth.js";
import { UserModel } from "../models/User.js";
import { asyncHandler, HttpError } from "../utils/http.js";

export const usersRouter = Router();

const updateMeSchema = z
  .object({
    name: z.string().min(1).optional(),
    department: z.string().min(1).optional(),
    mobile: z.string().min(5).optional(),
    collegeName: z.string().min(1).optional()
  })
  .refine((obj) => Object.keys(obj).length > 0, { message: "No fields to update" });

usersRouter.get(
  "/me",
  requireAuth,
  asyncHandler(async (req: AuthRequest, res) => {
    const user = await UserModel.findById(req.userId).select("-password");
    if (!user) throw new HttpError(404, "User not found");
    res.json({ user });
  })
);

usersRouter.put(
  "/me",
  requireAuth,
  asyncHandler(async (req: AuthRequest, res) => {
    const input = updateMeSchema.parse(req.body);

    const user = await UserModel.findById(req.userId);
    if (!user) throw new HttpError(404, "User not found");

    if (typeof input.name !== "undefined") user.name = input.name;
    if (typeof input.department !== "undefined") user.department = input.department;
    if (typeof input.mobile !== "undefined") user.mobile = input.mobile;
    if (typeof input.collegeName !== "undefined") user.collegeName = input.collegeName;

    try {
      await user.save();
    } catch (err) {
      // Handle unique index conflicts gracefully.
      if (typeof err === "object" && err && "code" in err && (err as any).code === 11000) {
        throw new HttpError(409, "A user with those details already exists");
      }
      throw err;
    }

    const safeUser = await UserModel.findById(req.userId).select("-password");
    res.json({ user: safeUser });
  })
);
