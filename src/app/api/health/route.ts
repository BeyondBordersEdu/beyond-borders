import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ status: "ok", service: "beyond-borders", timestamp: new Date().toISOString() });
}
