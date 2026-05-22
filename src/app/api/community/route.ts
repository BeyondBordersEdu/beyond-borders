import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    activeUsers: 12840,
    postsToday: 420,
    topChannels: ["Jobs", "Visa Help", "Interviews"],
    eventsThisWeek: 19
  });
}
