import { NextResponse } from "next/server";
import { z } from "zod";
import { readDB, writeDB } from "@/lib/server/mock-db";

const schema = z.object({ postId: z.string(), reason: z.string().min(3) });

export async function GET() {
  const db = await readDB();
  return NextResponse.json({ reports: db.communityReports });
}

export async function POST(req: Request) {
  const payload = schema.parse(await req.json());
  const db = await readDB();
  db.communityReports.unshift({
    id: crypto.randomUUID(),
    postId: payload.postId,
    reporterUserId: "demo-user",
    reason: payload.reason,
    status: "open",
    createdAt: new Date().toISOString()
  });
  await writeDB(db);
  return NextResponse.json({ ok: true });
}
