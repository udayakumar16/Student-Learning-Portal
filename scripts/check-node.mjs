import process from "node:process";

function parseMajor(version) {
  const m = /^v?(\d+)\./.exec(version);
  return m ? Number(m[1]) : NaN;
}

const major = parseMajor(process.version);
const supported = Number.isFinite(major) && major >= 18 && major < 23;
const strict = String(process.env.STRICT_NODE_CHECK ?? "").toLowerCase() === "1";
const quiet = String(process.env.QUIET_NODE_CHECK ?? "").toLowerCase() === "1";

if (!supported) {
  const msg = [
    `Unsupported Node.js version: ${process.version}`,
    `This repo expects Node 18/20/22 (see package.json engines: >=18.17 <23).`,
    `You're likely to see Next dev issues like: Cannot find module './127.js'.`,
    `Fix: install Node 20 LTS and re-run.`,
    `To enforce this check (fail fast): set STRICT_NODE_CHECK=1.`,
    `To silence this warning: set QUIET_NODE_CHECK=1.`
  ].join("\n");

  if (!quiet) {
    // eslint-disable-next-line no-console
    console.warn(msg);
  }
  if (strict) process.exit(1);
}
