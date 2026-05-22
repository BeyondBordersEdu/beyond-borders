import { promises as fs } from "node:fs";
import path from "node:path";
import type { PlatformDB } from "@/types/platform";

const dbPath = path.join(process.cwd(), "data", "mock-db.json");

export async function readDB(): Promise<PlatformDB> {
  const raw = await fs.readFile(dbPath, "utf8");
  return JSON.parse(raw) as PlatformDB;
}

export async function writeDB(db: PlatformDB) {
  await fs.writeFile(dbPath, JSON.stringify(db, null, 2), "utf8");
}
