import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    funnel: {
      visitors: 10000,
      onboarded: 4200,
      activated: 1830,
      premium: 244
    },
    conversionRate: 2.44,
    mentorBookings: 128,
    employerSubscriptions: 34
  });
}
