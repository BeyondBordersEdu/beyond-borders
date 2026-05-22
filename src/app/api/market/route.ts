import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    jobs: { total: 15234, visaSponsored: 6244 },
    scholarships: { total: 3120, closingSoon: 286 },
    universities: 260,
    employers: 890
  });
}
