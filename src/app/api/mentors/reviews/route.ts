import { NextResponse } from "next/server";
import { z } from "zod";
import { repo } from "@/lib/server/repository";
import { getCurrentUserId } from "@/lib/server/user";

const schema = z.object({ mentorId: z.string(), rating: z.number().min(1).max(5), comment: z.string().min(3) });

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const mentorId = searchParams.get("mentorId");
  const reviews = await repo.getMentorReviews(mentorId);
  return NextResponse.json({ reviews });
}

export async function POST(req: Request) {
  const userId = await getCurrentUserId();
  const p = schema.parse(await req.json());
  await repo.createMentorReview(p, userId);
  return NextResponse.json({ ok: true });
}
