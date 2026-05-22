import { PageShell } from "@/components/sections/page-shell";
import { BookingForm } from "@/components/booking/booking-form";

export default function Page() {
  return (
    <PageShell title="Book a Session" copy="Career calls, visa strategy sessions, and CV reviews with secure checkout.">
      <BookingForm />
    </PageShell>
  );
}
