/**
 * seed-kv.mjs — Upload local .data/*.json to Cloudflare KV
 * 
 * Usage (run from project root):
 *   node scripts/seed-kv.mjs --namespace-id=YOUR_KV_ID --account-id=YOUR_ACCOUNT_ID
 * 
 * Or set env vars:
 *   KV_NAMESPACE_ID=xxx CLOUDFLARE_ACCOUNT_ID=xxx CLOUDFLARE_API_TOKEN=xxx node scripts/seed-kv.mjs
 */

import { readFileSync, readdirSync, existsSync } from "fs";
import { join, basename } from "path";

const DATA_DIR = join(process.cwd(), ".data");
const FILES_TO_SEED = ["products", "categories", "site-content", "inquiries"];

// Parse CLI args
const args = process.argv.slice(2);
const getArg = (name) => {
  const a = args.find(a => a.startsWith(`--${name}=`));
  return a ? a.split("=")[1] : null;
};

const NAMESPACE_ID = getArg("namespace-id") || process.env.KV_NAMESPACE_ID;
const ACCOUNT_ID = getArg("account-id") || process.env.CLOUDFLARE_ACCOUNT_ID;
const API_TOKEN = getArg("token") || process.env.CLOUDFLARE_API_TOKEN;

if (!NAMESPACE_ID || !ACCOUNT_ID || !API_TOKEN) {
  console.error(`
❌ Missing required parameters. Set these env vars or pass as CLI args:

  KV_NAMESPACE_ID       — your KV namespace ID (from Cloudflare dashboard)
  CLOUDFLARE_ACCOUNT_ID — your Cloudflare account ID
  CLOUDFLARE_API_TOKEN  — your Cloudflare API token (with KV:Edit permission)

Example:
  KV_NAMESPACE_ID=abc123 CLOUDFLARE_ACCOUNT_ID=def456 CLOUDFLARE_API_TOKEN=ghi789 node scripts/seed-kv.mjs
`);
  process.exit(1);
}

async function putKV(key, value) {
  const url = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/storage/kv/namespaces/${NAMESPACE_ID}/values/${key}`;
  const res = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(value),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`KV PUT failed for "${key}": ${res.status} ${err}`);
  }
  return res;
}

async function main() {
  console.log(`\n🚀 Seeding KV namespace: ${NAMESPACE_ID}\n`);

  for (const key of FILES_TO_SEED) {
    const fp = join(DATA_DIR, `${key}.json`);
    if (!existsSync(fp)) {
      console.log(`⚠️  Skipping ${key} — file not found: ${fp}`);
      continue;
    }
    try {
      const raw = readFileSync(fp, "utf-8");
      const data = JSON.parse(raw);
      await putKV(key, data);
      const count = Array.isArray(data) ? `${data.length} items` : "object";
      console.log(`✅  ${key} → KV (${count})`);
    } catch (e) {
      console.error(`❌  ${key} failed:`, e.message);
    }
  }

  console.log("\n✨ Done! Your Cloudflare KV now has the latest data.");
  console.log("   After the next deployment, changes from your admin panel will persist.\n");
}

main();
