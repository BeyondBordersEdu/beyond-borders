import { NextResponse } from "next/server";
import { z } from "zod";
import { readDB, writeDB } from "@/lib/server/mock-db";

const schema = z.object({ roomId: z.string(), body: z.string().min(1) });

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const roomId = searchParams.get("roomId");
  const db = await readDB();
  const messages = roomId ? db.chatMessages.filter((m) => m.roomId === roomId) : db.chatMessages;
  return NextResponse.json({ messages });
}

export async function POST(req: Request) {
  const p = schema.parse(await req.json());
  const spamRes = await fetch(`${new URL(req.url).origin}/api/ai/spam-check`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: p.body })
  });
  const spam = (await spamRes.json()) as { flagged: boolean };

  const db = await readDB();
  db.chatMessages.push({
    id: crypto.randomUUID(),
    roomId: p.roomId,
    userId: "demo-user",
    author: "Demo User",
    body: p.body,
    flagged: spam.flagged,
    createdAt: new Date().toISOString()
  });
  await writeDB(db);

  return NextResponse.json({ ok: true, flagged: spam.flagged });
}
