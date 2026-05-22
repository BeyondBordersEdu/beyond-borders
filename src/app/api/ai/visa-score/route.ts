import { NextResponse } from "next/server";
import { repo } from "@/lib/server/repository";

export async function GET() {
  const profile = await repo.getProfile();
  if (!profile) return NextResponse.json({ score: 0, factors: [] });

  const score = Math.min(95, 58 + (profile.goal === "job" ? 10 : 5) + (profile.timeline.includes("6") ? 6 : 2));
  return NextResponse.json({
    score,
    factors: ["Education profile", "Target country pathway", "Work readiness", "Document readiness"]
  });
}
