import { NextResponse } from "next/server";
import { repo } from "@/lib/server/repository";

export async function GET() {
  const [profile, mentors] = await Promise.all([repo.getProfile(), repo.getMentors("All")]);
  const ranked = mentors
    .map((m) => ({ ...m, score: Math.min(99, Math.round(m.rating * 16 + (m.country === profile?.country ? 12 : 4))) }))
    .sort((a, b) => b.score - a.score);

  return NextResponse.json({ recommendations: ranked.slice(0, 5) });
}
