import { NextResponse } from "next/server";
import { z } from "zod";
import { repo } from "@/lib/server/repository";
import { getCurrentUserId } from "@/lib/server/user";

const schema = z.object({ title: z.string().min(3), body: z.string().min(3), channel: z.string(), country: z.string() });

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const country = searchParams.get("country");
  const channel = searchParams.get("channel");
  return NextResponse.json({ posts: await repo.getPosts(country, channel) });
}

export async function POST(req: Request) {
  const userId = await getCurrentUserId();
  const body = schema.parse(await req.json());
  await repo.createPost(body, userId);
  return NextResponse.json({ ok: true });
}

export async function PATCH(req: Request) {
  const { postId } = (await req.json()) as { postId: string };
  await repo.likePost(postId);
  return NextResponse.json({ ok: true });
}
