import { NextResponse } from "next/server";
import { repo } from "@/lib/server/repository";
import { sendEmail } from "@/lib/server/email";

function authorized(req: Request) {
  const expected = process.env.REMINDER_CRON_SECRET;
  if (!expected) return true;
  const header = req.headers.get("x-reminder-secret");
  return header === expected;
}

export async function POST(req: Request) {
  if (!authorized(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const sessions = await repo.getMentorSessions();
  const pending = sessions.filter((s) => s.status === "booked" && !s.reminderSentAt);

  for (const s of pending) {
    await sendEmail({
      to: "demo@beyondborders.ai",
      subject: "Mentor session reminder",
      html: `<p>Your mentor session is scheduled. Join via: <a href='${s.meetingLink || "#"}'>${s.meetingLink || "Meeting link"}</a></p>`
    });
    await repo.markSessionReminderSent(s.id);
  }

  return NextResponse.json({ reminded: pending.length });
}
