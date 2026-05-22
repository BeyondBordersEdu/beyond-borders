import { NextResponse } from "next/server";
import { z } from "zod";
import { repo } from "@/lib/server/repository";
import { getCurrentUserId } from "@/lib/server/user";

const schema = z.object({ mentorId: z.string(), bookingId: z.string(), amount: z.number(), commissionPercent: z.number().min(15).max(25) });

function createMeetingLink(sessionId: string) {
  const provider = process.env.MEETING_PROVIDER || "google-meet";
  const base = process.env.MEETING_BASE_URL || "https://meet.google.com";
  const roomCode = sessionId.slice(0, 3) + "-" + sessionId.slice(3, 6) + "-" + sessionId.slice(6, 9);
  return `${base}/${roomCode}?provider=${provider}`;
}

export async function GET() {
  const sessions = await repo.getMentorSessions();
  return NextResponse.json({ sessions });
}

export async function POST(req: Request) {
  const userId = await getCurrentUserId();
  const p = schema.parse(await req.json());
  const meetingLink = createMeetingLink(crypto.randomUUID().replace(/-/g, ""));
  const session = await repo.createMentorSession({ ...p, meetingLink }, userId);
  return NextResponse.json({ ok: true, session });
}

export async function PATCH(req: Request) {
  const { sessionId, status } = (await req.json()) as { sessionId: string; status: "completed" | "cancelled" };
  return NextResponse.json({ ok: true, sessionId, status });
}
