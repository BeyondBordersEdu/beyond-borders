"use client";

import { useState } from "react";

const services = [
  { id: "career_call", label: "Career Strategy Call" },
  { id: "visa_call", label: "Visa Pathway Call" },
  { id: "cv_review", label: "CV Review" }
] as const;

const times = ["09:00", "10:30", "12:00", "14:00", "16:00", "18:00"];

export function BookingForm() {
  const [service, setService] = useState<(typeof services)[number]["id"]>("career_call");
  const [date, setDate] = useState("");
  const [time, setTime] = useState(times[0]);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    setStatus("");
    try {
      const bookingRes = await fetch("/api/bookings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ service, date, time, email }) });
      if (!bookingRes.ok) throw new Error();
      const bookingData = await bookingRes.json();

      const checkoutRes = await fetch("/api/stripe/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ bookingId: bookingData.booking.id }) });
      const checkoutData = await checkoutRes.json();

      if (checkoutData.checkoutUrl) {
        window.location.href = checkoutData.checkoutUrl;
        return;
      }
      setStatus("Booking created. Payment session could not be opened.");
    } catch {
      setStatus("Could not complete booking. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border bg-card p-6">
      <h2 className="text-2xl font-semibold">Book a Session</h2>
      <p className="mt-1 text-sm text-slate-500">Select service, choose a time slot, and complete payment.</p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <label className="text-sm">Service<select value={service} onChange={(e) => setService(e.target.value as any)} className="mt-1 w-full rounded-lg border bg-transparent p-2">{services.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}</select></label>
        <label className="text-sm">Date<input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-1 w-full rounded-lg border bg-transparent p-2" /></label>
        <label className="text-sm">Time<select value={time} onChange={(e) => setTime(e.target.value)} className="mt-1 w-full rounded-lg border bg-transparent p-2">{times.map((t) => <option key={t}>{t}</option>)}</select></label>
        <label className="text-sm">Email<input value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full rounded-lg border bg-transparent p-2" placeholder="you@email.com" /></label>
      </div>
      <button onClick={submit} disabled={loading || !date || !email} className="mt-5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white">{loading ? "Processing..." : "Proceed to Payment"}</button>
      {status ? <p className="mt-3 text-sm">{status}</p> : null}
    </div>
  );
}
