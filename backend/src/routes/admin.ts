import { Router } from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { env } from "../config/env.js";
import { requireAdmin } from "../middleware/auth.js";
import { QuestionModel, SUBJECTS } from "../models/Question.js";
import { ResultModel } from "../models/Result.js";
import { UserModel } from "../models/User.js";
import { asyncHandler, HttpError } from "../utils/http.js";

export const adminRouter = Router();

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  setupKey: z.string().min(1)
});

adminRouter.post(
  "/register",
  asyncHandler(async (req, res) => {
    const input = registerSchema.parse(req.body);

    if (!env.ADMIN_SETUP_KEY) {
      throw new HttpError(400, "Admin signup is disabled (missing ADMIN_SETUP_KEY)");
    }

    if (input.setupKey !== env.ADMIN_SETUP_KEY) {
      throw new HttpError(401, "Invalid Admin Setup Key");
    }

    const email = input.email.toLowerCase();
    const existing = await UserModel.findOne({ email });
    if (existing) {
      if (existing.role === "admin") throw new HttpError(409, "Admin account already exists. Please login.");
      throw new HttpError(409, "Email already exists as a student. Use a different email.");
    }

    const hashed = await bcrypt.hash(input.password, 10);
    const registerNumber = `ADMIN-${crypto.randomBytes(6).toString("hex")}`;

    const user = await UserModel.create({
      name: input.name,
      registerNumber,
      department: "Administration",
      email,
      mobile: "0000000000",
      password: hashed,
      role: "admin",
      collegeName: "Admin"
    });

    const token = jwt.sign({ userId: String(user._id), role: "admin" }, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN as any
    });

    res.status(201).json({
      token,
      user: {
        id: String(user._id),
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  })
);

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

adminRouter.post(
  "/login",
  asyncHandler(async (req, res) => {
    const input = loginSchema.parse(req.body);

    const user = await UserModel.findOne({ email: input.email.toLowerCase() });
    if (!user || user.role !== "admin") throw new HttpError(401, "Invalid admin credentials");

    const ok = await bcrypt.compare(input.password, user.password);
    if (!ok) throw new HttpError(401, "Invalid admin credentials");

    const token = jwt.sign({ userId: String(user._id), role: "admin" }, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN as any
    });

    res.json({
      token,
      user: {
        id: String(user._id),
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  })
);

const questionCreateSchema = z.object({
  subject: z.enum(SUBJECTS),
  question: z.string().min(5),
  options: z.array(z.string().min(1)).length(4),
  correctOption: z.number().int().min(0).max(3)
});

adminRouter.get(
  "/questions",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const subject = typeof req.query.subject === "string" ? req.query.subject : undefined;

    const filter: Record<string, unknown> = {};
    if (subject) filter.subject = subject;

    const questions = await QuestionModel.find(filter)
      .select("subject question options correctOption createdAt")
      .sort({ createdAt: -1 });

    res.json({ questions });
  })
);

adminRouter.post(
  "/questions",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const input = questionCreateSchema.parse(req.body);

    const created = await QuestionModel.create(input);
    res.status(201).json({ question: created });
  })
);

adminRouter.delete(
  "/questions/:id",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const id = req.params.id;
    const deleted = await QuestionModel.findByIdAndDelete(id);
    if (!deleted) throw new HttpError(404, "Question not found");
    res.json({ ok: true });
  })
);

adminRouter.get(
  "/analytics",
  requireAdmin,
  asyncHandler(async (_req, res) => {
    const [studentsCount, attemptsCount] = await Promise.all([
      UserModel.countDocuments({ role: "student" }),
      ResultModel.countDocuments({})
    ]);

    const avgAgg = await ResultModel.aggregate([
      {
        $project: {
          subject: 1,
          createdAt: 1,
          pct: {
            $cond: [
              { $gt: ["$total", 0] },
              { $multiply: [{ $divide: ["$score", "$total"] }, 100] },
              0
            ]
          }
        }
      },
      {
        $group: {
          _id: null,
          avgPct: { $avg: "$pct" }
        }
      }
    ]);

    const avgScorePct = avgAgg?.[0]?.avgPct ? Math.round(avgAgg[0].avgPct * 10) / 10 : 0;

    const bySubject = await ResultModel.aggregate([
      {
        $project: {
          subject: 1,
          pct: {
            $cond: [
              { $gt: ["$total", 0] },
              { $multiply: [{ $divide: ["$score", "$total"] }, 100] },
              0
            ]
          }
        }
      },
      {
        $group: {
          _id: "$subject",
          attempts: { $sum: 1 },
          avgPct: { $avg: "$pct" }
        }
      },
      { $sort: { attempts: -1, _id: 1 } },
      {
        $project: {
          _id: 0,
          subject: "$_id",
          attempts: 1,
          avgScorePct: { $round: ["$avgPct", 1] }
        }
      }
    ]);

    const topStudents = await ResultModel.aggregate([
      {
        $project: {
          userId: 1,
          createdAt: 1,
          pct: {
            $cond: [
              { $gt: ["$total", 0] },
              { $multiply: [{ $divide: ["$score", "$total"] }, 100] },
              0
            ]
          }
        }
      },
      {
        $group: {
          _id: "$userId",
          attempts: { $sum: 1 },
          avgPct: { $avg: "$pct" },
          lastAttemptAt: { $max: "$createdAt" }
        }
      },
      { $sort: { attempts: -1, avgPct: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user"
        }
      },
      { $unwind: "$user" },
      { $match: { "user.role": "student" } },
      {
        $project: {
          _id: 0,
          userId: { $toString: "$_id" },
          name: "$user.name",
          registerNumber: "$user.registerNumber",
          department: "$user.department",
          attempts: 1,
          avgScorePct: { $round: ["$avgPct", 1] },
          lastAttemptAt: 1
        }
      }
    ]);

    const recentResults = await ResultModel.find({})
      .sort({ createdAt: -1 })
      .limit(20)
      .populate({
        path: "userId",
        select: "name registerNumber department role"
      })
      .lean();

    const recentAttempts = recentResults
      .filter((r) => {
        const u = r.userId as any;
        return u && u.role === "student";
      })
      .map((r) => {
        const u = r.userId as any;
        return {
          id: String(r._id),
          user: {
            id: String(u._id),
            name: u.name as string,
            registerNumber: u.registerNumber as string,
            department: u.department as string
          },
          subject: r.subject as string,
          score: r.score as number,
          total: r.total as number,
          createdAt: r.createdAt
        };
      });

    res.json({
      kpis: {
        students: studentsCount,
        attempts: attemptsCount,
        avgScorePct
      },
      bySubject,
      topStudents,
      recentAttempts
    });
  })
);
