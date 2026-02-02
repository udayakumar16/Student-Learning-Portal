import { Router } from "express";
import { requireAuth, type AuthRequest } from "../middleware/auth.js";
import { ResultModel } from "../models/Result.js";
import { asyncHandler } from "../utils/http.js";

export const analyticsRouter = Router();

analyticsRouter.get(
  "/me",
  requireAuth,
  asyncHandler(async (req: AuthRequest, res) => {
    const results = await ResultModel.find({ userId: req.userId }).sort({ createdAt: -1 });

    const latestBySubject = new Map<
      string,
      { subject: string; score: number; total: number; createdAt: Date }
    >();

    for (const r of results) {
      if (!latestBySubject.has(r.subject)) {
        latestBySubject.set(r.subject, {
          subject: r.subject,
          score: r.score,
          total: r.total,
          createdAt: r.createdAt
        });
      }
    }

    res.json({ subjects: Array.from(latestBySubject.values()) });
  })
);
