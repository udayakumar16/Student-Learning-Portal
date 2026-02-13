import { createApp } from "./app.js";
import { connectDb } from "./config/db.js";
import { env } from "./config/env.js";
import { ensureAdminUser } from "./utils/ensureAdmin.js";
import { SubjectModel } from "./models/Subject.js";

type DbStatus = { connected: boolean; error?: string | null };

function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

async function ensureDefaultSubjects() {
  const count = await SubjectModel.countDocuments({});
  if (count > 0) return;

  await SubjectModel.insertMany(
    [
      { slug: "python", label: "Python", active: true },
      { slug: "ai", label: "Artificial Intelligence", active: true },
      { slug: "dbms", label: "DBMS", active: true }
    ],
    { ordered: true }
  );
}

async function main() {
  let dbStatus: DbStatus = { connected: false, error: "Not connected" };

  const app = createApp({
    getDbStatus: () => dbStatus
  });

  const server = app.listen(env.PORT, () => {
  console.log(`Server running on port ${env.PORT}`);
});


  server.on("error", (err) => {
    console.error("HTTP server error:", err);
  });

  // Connect to MongoDB in the background so the server stays reachable even if
  // Atlas/DNS is temporarily blocked.
  let attempt = 0;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    attempt += 1;
    try {
      await connectDb();
      dbStatus = { connected: true, error: null };
      await ensureDefaultSubjects();
      await ensureAdminUser();
      break;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown DB error";
      dbStatus = { connected: false, error: message };
      console.error(`DB connection failed (attempt ${attempt}):`, err);

      // Backoff: 2s, 5s, 10s, 15s (cap)
      const backoffMs = Math.min(15000, attempt === 1 ? 2000 : attempt === 2 ? 5000 : attempt === 3 ? 10000 : 15000);
      await sleep(backoffMs);
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
