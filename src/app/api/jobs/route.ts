import { NextResponse } from "next/server";
import { repo } from "@/lib/server/repository";
import { getCurrentUserId } from "@/lib/server/user";

export async function GET(req: Request) {
  const userId = await getCurrentUserId();
  const { searchParams } = new URL(req.url);
  const country = searchParams.get("country");
  const visaOnly = searchParams.get("visaOnly") === "true";
  const data = await repo.getJobs(country, visaOnly, userId);
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const userId = await getCurrentUserId();
  const { jobId, action } = (await req.json()) as { jobId: string; action: "save" | "apply" };
  await repo.saveJob(jobId, action, userId);
  return NextResponse.json({ ok: true });
}
