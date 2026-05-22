import { NextResponse } from "next/server";
import { z } from "zod";
import { repo } from "@/lib/server/repository";
import { sendEmail } from "@/lib/server/email";
import { getCurrentUserId } from "@/lib/server/user";

const schema = z.object({ service: z.enum(["career_call", "visa_call", "cv_review"]), date: z.string(), time: z.string(), email: z.string().email() });
const prices = { career_call: 4900, visa_call: 6900, cv_review: 3900 } as const;

export async function GET() {
  return NextResponse.json({ bookings: await repo.getBookings() });
}

export async function POST(req: Request) {
  const userId = await getCurrentUserId();
  const payload = schema.parse(await req.json());
  const booking = await repo.createBooking({ ...payload, amount: prices[payload.service] }, userId);

  await sendEmail({ to: booking.email, subject: "Beyond Borders booking created", html: `<p>Your ${booking.service} booking is created for ${booking.date} ${booking.time}. Complete payment to confirm.</p>` });
  return NextResponse.json({ booking });
}

export async function PATCH(req: Request) {
  const { bookingId, status } = (await req.json()) as { bookingId: string; status: "paid" | "confirmed" };
  const booking = await repo.updateBookingStatus(bookingId, status);
  if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  return NextResponse.json({ booking });
}
