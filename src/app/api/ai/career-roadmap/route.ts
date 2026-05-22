import { NextResponse } from "next/server";
import { generateBeyondPlan } from "@/lib/ai/beyond-engine";
import { repo } from "@/lib/server/repository";

export async function GET() {
  const profile = await repo.getProfile();
  if (!profile) return NextResponse.json({ roadmap: [], skillGaps: [], recommendedJobs: [] });
  const plan = generateBeyondPlan(profile);
  return NextResponse.json({ roadmap: plan.roadmap, skillGaps: plan.skillGaps, recommendedJobs: plan.jobMatches });
}
