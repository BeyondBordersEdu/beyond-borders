import { NextResponse } from "next/server";
import { readDB } from "@/lib/server/mock-db";

export async function GET() {
  const db = await readDB();
  return NextResponse.json({ rooms: db.chatRooms });
}
