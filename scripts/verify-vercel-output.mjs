import { existsSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const expectedOutput = ".output/dist";
const serverEntry = ".output/server/index.mjs";

function fail(message) {
  console.error(`[vercel-output-check] ${message}`);
  process.exit(1);
}

function countFiles(dir) {
  let total = 0;
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const stat = statSync(full);
    total += stat.isDirectory() ? countFiles(full) : 1;
  }
  return total;
}

if (!existsSync(expectedOutput)) {
  fail(`Dossier public attendu introuvable: ${expectedOutput}`);
}

if (!existsSync(serverEntry)) {
  fail(`Entrée serveur attendue introuvable: ${serverEntry}`);
}

const publicFiles = countFiles(expectedOutput);
if (publicFiles === 0) {
  fail(`${expectedOutput} est vide, Vercel refuserait la sortie de build.`);
}

const manifest = {
  checkedAt: new Date().toISOString(),
  vercelOutputDirectory: expectedOutput,
  serverEntry,
  publicFiles,
  deployment: {
    environment: process.env.VERCEL_ENV ?? "local",
    url: process.env.VERCEL_URL ?? null,
    gitCommit: process.env.VERCEL_GIT_COMMIT_SHA ?? null,
  },
};

writeFileSync(join(expectedOutput, "build-diagnostics.json"), `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`[vercel-output-check] OK: ${expectedOutput} (${publicFiles} fichiers), serveur: ${serverEntry}`);