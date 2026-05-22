import { NextResponse } from "next/server";
import { repo } from "@/lib/server/repository";

export async function GET() {
  const [profile, jobsData] = await Promise.all([repo.getProfile(), repo.getJobs(null, false)]);
  if (!profile) return NextResponse.json({ matches: [] });

  const ranked = jobsData.jobs
    .map((job) => ({
      ...job,
      score: Math.min(98, 55 + (job.visaSponsored ? 22 : 8) + (job.country === profile.country ? 12 : 4) + (job.tags.includes("AI") ? 6 : 0))
    }))
    .sort((a, b) => b.score - a.score);

  return NextResponse.json({ matches: ranked });
}
