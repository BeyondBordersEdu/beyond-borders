import { NextResponse } from "next/server";
import { repo } from "@/lib/server/repository";

export async function GET() {
  const [profile, scholarshipsData] = await Promise.all([repo.getProfile(), repo.getScholarships("All")]);
  const ranked = scholarshipsData.scholarships
    .map((s) => ({
      ...s,
      score: Math.min(96, 48 + (s.country === profile?.country ? 22 : 10) + (s.tags.includes("STEM") ? 8 : 4))
    }))
    .sort((a, b) => b.score - a.score);

  return NextResponse.json({ matches: ranked });
}
