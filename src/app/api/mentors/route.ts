import { NextResponse } from "next/server";
import { repo } from "@/lib/server/repository";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const country = searchParams.get("country");
  return NextResponse.json({ mentors: await repo.getMentors(country) });
}
