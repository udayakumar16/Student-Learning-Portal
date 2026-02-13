import process from "node:process";

function parseMajor(version) {
  const m = /^v?(\d+)\./.exec(version);
  return m ? Number(m[1]) : NaN;
}

const major = parseMajor(process.version);
const supported = Number.isFinite(major) && major >= 18 && major < 23;
const strict = String(process.env.STRICT_NODE_CHECK ?? "").toLowerCase() === "1";
const fail = String(process.env.FAIL_NODE_CHECK ?? "").toLowerCase() === "1";
const warnOnly = String(process.env.WARN_ONLY_NODE_CHECK ?? "").toLowerCase() === "1";
const allowUnsupported = String(process.env.ALLOW_UNSUPPORTED_NODE ?? "").toLowerCase() === "1";
const quiet = String(process.env.QUIET_NODE_CHECK ?? "").toLowerCase() === "1";

if (!supported) {
  const msg = [
    `Unsupported Node.js version: ${process.version}`,
    `This repo expects Node 18/20/22 (see package.json engines: >=18.17 <23).`,
    `You're likely to see Next dev issues like: Cannot find module './127.js'.`,
    `Fix: switch to the version in .nvmrc (recommended: Node 20.11.1) and re-run.`,
    `Windows (nvm-windows): nvm install 20.11.1 ; nvm use 20.11.1`,
    `Dev server may crash or serve broken assets on Node 23/24+ (especially on Windows).`,
    `This check fails fast by default to avoid flaky dev sessions.`,
    `Override (not recommended): set ALLOW_UNSUPPORTED_NODE=1 or WARN_ONLY_NODE_CHECK=1.`,
    `To silence this message: set QUIET_NODE_CHECK=1.`
  ].join("\n");

  if (!quiet) {
    // eslint-disable-next-line no-console
    console.warn(msg);
  }
  if (allowUnsupported || warnOnly) process.exit(0);
  if (strict || fail) process.exit(1);
  process.exit(1);
}
