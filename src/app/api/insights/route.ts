import { NextResponse } from "next/server";

export async function GET() {
  const t = Date.now();
  return NextResponse.json({
    jobsPostedLastHour: 35 + (t % 21),
    scholarshipsClosingThisWeek: 14 + (t % 12),
    visaPolicyUpdates: 1 + (t % 4),
    trendingSkills: ["Agentic AI", "Prompt Ops", "Data Governance"]
  });
}
