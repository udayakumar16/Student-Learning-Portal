import process from "node:process";

const allow = String(process.env.ALLOW_TURBOPACK ?? "").toLowerCase() === "1";

if (allow) process.exit(0);

const msg = [
  "Turbopack dev is disabled in this repo by default.",
  "Reason: on Windows + newer Node versions, Next 14.2.x can hit a Webpack/Turbopack RSC bindings mismatch:",
  "  Expected to use Webpack bindings ... but referencing Turbopack bindings ...",
  "Use Webpack dev instead:",
  "  npm run dev:frontend:clean",
  "Or switch Node to the supported version (.nvmrc = 20.11.1) and run normally.",
  "Override (not recommended): set ALLOW_TURBOPACK=1",
].join("\n");

// eslint-disable-next-line no-console
console.error(msg);
process.exit(1);
