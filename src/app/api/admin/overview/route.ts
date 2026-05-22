import { NextResponse } from "next/server";
import { repo } from "@/lib/server/repository";

export async function GET() {
  const [profile, bookings, enquiries] = await Promise.all([
    repo.getProfile(),
    repo.getBookings(),
    repo.getEnquiries()
  ]);

  return NextResponse.json({
    users: profile ? 1 : 0,
    bookings,
    enquiries,
    recentUsers: profile ? [profile] : []
  });
}
