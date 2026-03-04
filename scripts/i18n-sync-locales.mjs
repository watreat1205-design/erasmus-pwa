// scripts/i18n-sync-locales.mjs
import fs from "node:fs";
import path from "node:path";

const LOCALES_DIR = path.join(process.cwd(), "src", "locales");
const BASE_LANG = "en";

// Usage:
//   node scripts/i18n-sync-locales.mjs
//   node scripts/i18n-sync-locales.mjs common.json
//   node scripts/i18n-sync-locales.mjs activities/activity-1-1.json
const REL_PATH = process.argv[2] ?? "common.json";

// Choose how to fill missing values:
// "en"    -> copy English string into missing keys
// "empty" -> fill missing keys with ""
const FILL_MODE = "en";

// If true: deletes keys that don't exist in the base file (en/<REL_PATH>)
const REMOVE_EXTRAS = false;

const TARGET_LANGS = ["el", "it", "es", "ro", "hr"]; // adjust if needed

function readJson(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  try {
    return JSON.parse(raw);
  } catch (e) {
    throw new Error(`Invalid JSON: ${filePath}\n${e.message}`);
  }
}

function writeJson(filePath, obj) {
  const content = JSON.stringify(obj, null, 2) + "\n";
  fs.writeFileSync(filePath, content, "utf8");
}

function isPlainObject(v) {
  return v && typeof v === "object" && !Array.isArray(v);
}

function walkKeys(obj, prefix = "") {
  const keys = [];
  for (const k of Object.keys(obj)) {
    const next = prefix ? `${prefix}.${k}` : k;
    if (isPlainObject(obj[k])) keys.push(...walkKeys(obj[k], next));
    else keys.push(next);
  }
  return keys;
}

function getByPath(obj, dotted) {
  const parts = dotted.split(".");
  let cur = obj;
  for (const p of parts) {
    if (!isPlainObject(cur) && !Array.isArray(cur)) return undefined;
    if (!(p in cur)) return undefined;
    cur = cur[p];
  }
  return cur;
}

function setByPath(obj, dotted, value) {
  const parts = dotted.split(".");
  let cur = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    const p = parts[i];
    if (!(p in cur) || !isPlainObject(cur[p])) cur[p] = {};
    cur = cur[p];
  }
  cur[parts.at(-1)] = value;
}

function deleteByPath(obj, dotted) {
  const parts = dotted.split(".");
  let cur = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    const p = parts[i];
    if (!(p in cur)) return;
    cur = cur[p];
    if (!isPlainObject(cur)) return;
  }
  delete cur[parts.at(-1)];
}

function pruneEmptyObjects(obj) {
  if (!isPlainObject(obj)) return obj;
  for (const k of Object.keys(obj)) {
    obj[k] = pruneEmptyObjects(obj[k]);
    if (isPlainObject(obj[k]) && Object.keys(obj[k]).length === 0) {
      delete obj[k];
    }
  }
  return obj;
}

function main() {
  const basePath = path.join(LOCALES_DIR, BASE_LANG, REL_PATH);

  if (!fs.existsSync(basePath)) {
    console.error(`❌ Base file not found: ${basePath}`);
    console.error(
      `Tip: pass the relative path from src/locales/<lang>/ ... e.g.\n` +
        `  node scripts/i18n-sync-locales.mjs common.json\n` +
        `  node scripts/i18n-sync-locales.mjs activities/activity-1-1.json`
    );
    process.exitCode = 2;
    return;
  }

  const base = readJson(basePath);
  const baseKeys = new Set(walkKeys(base));

  console.log(`Base: ${basePath}`);
  console.log(`Base keys: ${baseKeys.size}\n`);

  let hadIssues = false;

  for (const lang of TARGET_LANGS) {
    const filePath = path.join(LOCALES_DIR, lang, REL_PATH);

    if (!fs.existsSync(filePath)) {
      console.log(`❌ Missing file: ${filePath}`);
      hadIssues = true;
      continue;
    }

    const obj = readJson(filePath);
    const keys = new Set(walkKeys(obj));

    const missing = [...baseKeys].filter((k) => !keys.has(k));
    const extra = [...keys].filter((k) => !baseKeys.has(k));

    if (missing.length === 0 && extra.length === 0) {
      console.log(`✅ ${lang}: in sync (${keys.size} keys)`);
      continue;
    }

    hadIssues = true;
    console.log(`⚠️  ${lang}:`);
    if (missing.length)
      console.log(
        `  - Missing (${missing.length}):`,
        missing.slice(0, 30),
        missing.length > 30 ? "..." : ""
      );
    if (extra.length)
      console.log(
        `  - Extra   (${extra.length}):`,
        extra.slice(0, 30),
        extra.length > 30 ? "..." : ""
      );

    // Auto-fix
    if (missing.length || (REMOVE_EXTRAS && extra.length)) {
      for (const k of missing) {
        const enVal = getByPath(base, k);
        const val = FILL_MODE === "empty" ? "" : enVal;
        setByPath(obj, k, val);
      }

      if (REMOVE_EXTRAS) {
        for (const k of extra) deleteByPath(obj, k);
        pruneEmptyObjects(obj);
      }

      writeJson(filePath, obj);
      console.log(`  → wrote updates to ${filePath}`);
    }
  }

  if (hadIssues) {
    console.log("\nDone. Some locales were out of sync (see above).");
    process.exitCode = 2; // useful for CI
  } else {
    console.log("\nAll locales are fully in sync.");
  }
}

main();
