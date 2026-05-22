import { NextResponse } from "next/server";
import { repo } from "@/lib/server/repository";
import { getCurrentUserId } from "@/lib/server/user";

export async function GET() {
  const userId = await getCurrentUserId();
  const [apps, bookings] = await Promise.all([repo.getApplications(userId), repo.getBookings()]);
  const mine = bookings.filter((b) => b.userId === userId);
  const score = Math.min(100, 35 + apps.length * 8 + mine.length * 6);

  return NextResponse.json({
    careerScore: score,
    weeklyReport: {
      applications: apps.length,
      scholarshipSaves: apps.filter((a) => a.type === "scholarship").length,
      mentorBookings: mine.length,
      recommendation: "Complete one mock interview and apply to 3 visa-sponsored jobs this week."
    }
  });
}
