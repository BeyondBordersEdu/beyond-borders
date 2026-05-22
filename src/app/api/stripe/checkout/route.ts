import { NextResponse } from "next/server";
import Stripe from "stripe";
import { repo } from "@/lib/server/repository";

const stripeKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeKey ? new Stripe(stripeKey) : null;
const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export async function POST(req: Request) {
  const { bookingId } = (await req.json()) as { bookingId: string };
  const bookings = await repo.getBookings();
  const booking = bookings.find((b) => b.id === bookingId);
  if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });

  if (!stripe) {
    return NextResponse.json({ checkoutUrl: `${appUrl}/book?payment=simulated&bookingId=${bookingId}`, provider: "simulated" });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    success_url: `${appUrl}/book?payment=success&bookingId=${bookingId}`,
    cancel_url: `${appUrl}/book?payment=cancelled&bookingId=${bookingId}`,
    customer_email: booking.email,
    metadata: { bookingId },
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "gbp",
          unit_amount: booking.amount,
          product_data: { name: `Beyond Borders ${booking.service}` }
        }
      }
    ]
  });

  return NextResponse.json({ checkoutUrl: session.url, provider: "stripe" });
}
