import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import { authRouter } from "./routes/auth.js";
import { usersRouter } from "./routes/users.js";
import { questionsRouter } from "./routes/questions.js";
import { resultsRouter } from "./routes/results.js";
import { analyticsRouter } from "./routes/analytics.js";
import { supportRouter } from "./routes/support.js";
import { adminRouter } from "./routes/admin.js";
import { subjectsRouter } from "./routes/subjects.js";
import { HttpError } from "./utils/http.js";

type DbStatus = { connected: boolean; error?: string | null };

export function createApp(opts?: { getDbStatus?: () => DbStatus }) {
  const app = express();

  const isProd = process.env.NODE_ENV === "production";
  const defaultDevOrigins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001"
  ];

  const configuredOrigins = (env.CORS_ORIGIN || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const allowedOrigins = new Set<string>([
    ...(isProd ? [] : defaultDevOrigins),
    ...configuredOrigins
  ]);

  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow non-browser tools (no Origin header)
        if (!origin) return callback(null, true);
        if (allowedOrigins.has(origin)) return callback(null, true);
        return callback(new Error(`CORS blocked origin: ${origin}`));
      },
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"]
    })
  );
  app.use(express.json());

  // If DB isn't connected, fail fast for API routes that depend on Mongo.
  // This avoids confusing timeouts and "failed to fetch" UX.
  app.use((req, res, next) => {
    const db = opts?.getDbStatus ? opts.getDbStatus() : undefined;
    if (db && !db.connected && req.path.startsWith("/api")) {
      return res.status(503).json({ error: "Database unavailable", db });
    }
    return next();
  });

  app.get("/", (_req, res) => {
    res.json({
      ok: true,
      message: "Student Learning Platform API",
      health: "/health",
      apiBase: "/api"
    });
  });

  // Optional DB status for environments where Mongo may be temporarily unavailable.
  // This prevents confusing "connection refused" UX on the frontend.
  app.get("/health", (_req, res) => {
    const db = opts?.getDbStatus ? opts.getDbStatus() : undefined;
    res.json({ ok: true, db });
  });

  app.use("/api/auth", authRouter);
  app.use("/api/admin", adminRouter);
  app.use("/api/users", usersRouter);
  app.use("/api/questions", questionsRouter);
  app.use("/api/results", resultsRouter);
  app.use("/api/analytics", analyticsRouter);
  app.use("/api/support", supportRouter);
  app.use("/api/subjects", subjectsRouter);

  app.use((req, _res, next) => {
    next(new HttpError(404, `Not Found: ${req.method} ${req.path}`));
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    if (err instanceof HttpError) {
      return res.status(err.status).json({ error: err.message });
    }

    // Zod errors
    if (typeof err === "object" && err && "issues" in err) {
      return res.status(400).json({ error: "Validation error", details: err });
    }

    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  });

  return app;
}
