import { Router } from "express";
import { z } from "zod";
import { requireAuth, type AuthRequest } from "../middleware/auth.js";
import { ResultModel } from "../models/Result.js";
import { asyncHandler } from "../utils/http.js";

export const resultsRouter = Router();

const createSchema = z.object({
  subject: z.string().min(1),
  score: z.number().int().min(0),
  total: z.number().int().min(1)
});

resultsRouter.post(
  "/",
  requireAuth,
  asyncHandler(async (req: AuthRequest, res) => {
    const input = createSchema.parse(req.body);

    const result = await ResultModel.create({
      userId: req.userId,
      subject: input.subject,
      score: input.score,
      total: input.total
    });

    res.status(201).json({ result });
  })
);

resultsRouter.get(
  "/me",
  requireAuth,
  asyncHandler(async (req: AuthRequest, res) => {
    const results = await ResultModel.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json({ results });
  })
);
