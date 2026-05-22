import { NextResponse } from "next/server";

export async function GET() {
  const now = Date.now();
  return NextResponse.json({
    generatedAt: new Date(now).toISOString(),
    jobsPostedLastHour: 42 + (now % 15),
    scholarshipsClosingThisWeek: 18 + (now % 9),
    visaPolicyUpdates: 2 + (now % 3),
    trendingSkills: ["AI Product Analytics", "Cloud Security", "Data Storytelling"]
  });
}
