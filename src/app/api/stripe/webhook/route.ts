import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { repo } from "@/lib/server/repository";
import { sendEmail } from "@/lib/server/email";

const stripeKey = process.env.STRIPE_SECRET_KEY;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
const stripe = stripeKey ? new Stripe(stripeKey) : null;

export async function POST(req: Request) {
  if (!stripe || !webhookSecret) return NextResponse.json({ ok: true, skipped: true });

  const body = await req.text();
  const headersList = await headers();
  const sig = headersList.get("stripe-signature");
  if (!sig) return NextResponse.json({ error: "Missing signature" }, { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const bookingId = session.metadata?.bookingId;
    if (bookingId) {
      const booking = await repo.updateBookingStatus(bookingId, "confirmed");
      if (booking) {
        await sendEmail({
          to: booking.email,
          subject: "Booking confirmed",
          html: `<p>Your session is confirmed for ${booking.date} ${booking.time}.</p>`
        });
      }
    }
  }

  return NextResponse.json({ received: true });
}
