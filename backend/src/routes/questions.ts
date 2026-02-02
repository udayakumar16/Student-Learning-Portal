import { Router } from "express";
import { z } from "zod";
import { QuestionModel } from "../models/Question.js";
import { asyncHandler } from "../utils/http.js";

export const questionsRouter = Router();

const querySchema = z.object({
  subject: z.string().min(1),
  limit: z
    .preprocess((v) => {
      if (v === undefined || v === null || v === "") return undefined;
      const n = typeof v === "string" ? Number(v) : v;
      return Number.isFinite(n) ? n : undefined;
    }, z.number().int().min(1).max(50).optional())
});

questionsRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const { subject, limit } = querySchema.parse(req.query);

    const effectiveLimit = limit ?? 5;

    const questions = await QuestionModel.find({ subject })
      .select("subject question options correctOption")
      .sort({ createdAt: 1 })
      .limit(effectiveLimit);

    res.json({ questions });
  })
);
