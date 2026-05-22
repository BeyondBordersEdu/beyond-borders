import { NextResponse } from "next/server";
import { repo } from "@/lib/server/repository";
import { getCurrentUserId } from "@/lib/server/user";

export async function GET() {
  const userId = await getCurrentUserId();
  const profile = await repo.getProfile(userId);
  if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  return NextResponse.json(profile);
}
