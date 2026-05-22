import { NextResponse } from "next/server";
import { z } from "zod";
import { repo } from "@/lib/server/repository";
import { getCurrentUserId } from "@/lib/server/user";

const schema = z.object({ goal: z.string(), country: z.string(), education: z.string(), budget: z.string(), interest: z.string(), timeline: z.string() });

export async function POST(req: Request) {
  const body = schema.parse(await req.json());
  const userId = await getCurrentUserId();
  const profile = await repo.saveOnboarding(body, userId);
  if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  return NextResponse.json(profile);
}
