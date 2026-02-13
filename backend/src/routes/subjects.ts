import { Router } from "express";
import { requireAuth, type AuthRequest } from "../middleware/auth.js";
import { SubjectModel } from "../models/Subject.js";
import { asyncHandler } from "../utils/http.js";

export const subjectsRouter = Router();

subjectsRouter.get(
  "/",
  requireAuth,
  asyncHandler(async (_req: AuthRequest, res) => {
    const subjects = await SubjectModel.find({ active: true }).select("slug label").sort({ label: 1 });
    res.json({ subjects });
  })
);
