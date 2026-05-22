import { NextResponse } from "next/server";
import { repo } from "@/lib/server/repository";
import { getCurrentUserId } from "@/lib/server/user";

export async function GET(req: Request) {
  const userId = await getCurrentUserId();
  const { searchParams } = new URL(req.url);
  const country = searchParams.get("country");
  return NextResponse.json(await repo.getScholarships(country, userId));
}

export async function POST(req: Request) {
  const userId = await getCurrentUserId();
  const { scholarshipId } = (await req.json()) as { scholarshipId: string };
  await repo.saveScholarship(scholarshipId, userId);
  return NextResponse.json({ ok: true });
}
