import { Router } from "express";
import { z } from "zod";
import { requireAuth, type AuthRequest } from "../middleware/auth.js";
import { SupportRequestModel } from "../models/SupportRequest.js";
import { asyncHandler } from "../utils/http.js";

export const supportRouter = Router();

const createSchema = z.object({
  issueType: z.string().min(1),
  subject: z.string().min(1),
  description: z.string().min(5)
});

supportRouter.post(
  "/",
  requireAuth,
  asyncHandler(async (req: AuthRequest, res) => {
    const input = createSchema.parse(req.body);

    const request = await SupportRequestModel.create({
      userId: req.userId,
      issueType: input.issueType,
      subject: input.subject,
      description: input.description
    });

    res.status(201).json({ request });
  })
);
