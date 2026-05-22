import { NextResponse } from "next/server";
import { z } from "zod";
import { readDB, writeDB } from "@/lib/server/mock-db";

const schema = z.object({ title: z.string().min(3), category: z.enum(["study_abroad", "visa_experience", "job_tips"]), mediaType: z.enum(["audio", "video"]), mediaUrl: z.string().url() });

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const db = await readDB();
  const episodes = category && category !== "all" ? db.podcastEpisodes.filter((e) => e.category === category) : db.podcastEpisodes;
  return NextResponse.json({ episodes });
}

export async function POST(req: Request) {
  const p = schema.parse(await req.json());
  const db = await readDB();
  db.podcastEpisodes.unshift({ id: crypto.randomUUID(), author: "Demo User", likes: 0, comments: [], createdAt: new Date().toISOString(), ...p });
  await writeDB(db);
  return NextResponse.json({ ok: true });
}

export async function PATCH(req: Request) {
  const { id } = (await req.json()) as { id: string };
  const db = await readDB();
  const ep = db.podcastEpisodes.find((e) => e.id === id);
  if (!ep) return NextResponse.json({ error: "Not found" }, { status: 404 });
  ep.likes += 1;
  await writeDB(db);
  return NextResponse.json({ ok: true, likes: ep.likes });
}
