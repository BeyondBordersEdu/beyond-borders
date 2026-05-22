import { NextResponse } from "next/server";
import { repo } from "@/lib/server/repository";
import { getCurrentUserId } from "@/lib/server/user";

export async function GET() {
  const userId = await getCurrentUserId();
  return NextResponse.json({ notifications: await repo.getNotifications(userId) });
}

export async function PATCH(req: Request) {
  const userId = await getCurrentUserId();
  const { id } = (await req.json()) as { id: string };
  await repo.markNotificationRead(id, userId);
  return NextResponse.json({ ok: true });
}
