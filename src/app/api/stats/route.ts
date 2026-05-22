import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    studentsSupported: 120000,
    countriesRepresented: 94,
    scholarshipsAwardedUsd: 85000000,
    jobsSecured: 21000
  });
}
