"use client";

import { useEffect, useState } from "react";

type Mentor = { id: string; name: string; field: string; rating: number; sessions: number; country: string; score?: number };
type MentorSession = { id: string; mentorId: string; meetingLink?: string; status: string };
type Review = { id: string; mentorId: string; rating: number; comment: string };

const slots = ["09:00", "11:00", "14:00", "17:00"];

export function MentorshipMarketplacePro() {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [selectedMentor, setSelectedMentor] = useState<string>("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState(slots[0]);
  const [status, setStatus] = useState("");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [mySessions, setMySessions] = useState<MentorSession[]>([]);

  const load = async () => {
    const [r1, r2, r3] = await Promise.all([
      fetch("/api/ai/mentor-recommendations").then((r) => r.json()),
      fetch("/api/mentors/reviews").then((r) => r.json()),
      fetch("/api/mentors/sessions").then((r) => r.json())
    ]);
    setMentors(r1.recommendations || []);
    setReviews(r2.reviews || []);
    setMySessions(r3.sessions || []);
    if (!selectedMentor && r1.recommendations?.length) setSelectedMentor(r1.recommendations[0].id);
  };

  useEffect(() => { load(); }, []);

  const book = async () => {
    if (!selectedMentor || !date) return;
    const bookingRes = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ service: "career_call", date, time, email: "demo@beyondborders.ai" })
    }).then((r) => r.json());

    const sessionRes = await fetch("/api/mentors/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mentorId: selectedMentor, bookingId: bookingRes.booking.id, amount: bookingRes.booking.amount, commissionPercent: 20 })
    }).then((r) => r.json());

    const checkout = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookingId: bookingRes.booking.id })
    }).then((r) => r.json());

    if (checkout.checkoutUrl) window.location.href = checkout.checkoutUrl;
    else setStatus("Session created, payment link unavailable.");
    if (sessionRes?.session?.meetingLink) setStatus(`Session created. Meeting link: ${sessionRes.session.meetingLink}`);
  };

  const submitReview = async () => {
    if (!selectedMentor) return;
    await fetch("/api/mentors/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mentorId: selectedMentor, rating: 5, comment: "Excellent guidance for sponsorship pathway." })
    });
    setStatus("Review submitted.");
    load();
  };

  return (
    <div className="space-y-5">
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {mentors.map((m) => (
          <article key={m.id} className={`rounded-2xl border p-4 ${selectedMentor === m.id ? "border-primary bg-primary/10" : "bg-card"}`}>
            <p className="font-semibold">{m.name}</p>
            <p className="mt-1 text-sm text-slate-500">{m.field} · {m.country}</p>
            <p className="mt-1 text-xs">AI fit {m.score}% · Rating {m.rating}</p>
            <button className="mt-3 rounded-full border px-3 py-1 text-xs" onClick={() => setSelectedMentor(m.id)}>Select mentor</button>
          </article>
        ))}
      </div>

      <section className="rounded-2xl border bg-card p-5">
        <h3 className="font-semibold">Book Session</h3>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="rounded-xl border bg-transparent p-2 text-sm" />
          <select value={time} onChange={(e) => setTime(e.target.value)} className="rounded-xl border bg-transparent p-2 text-sm">{slots.map((s) => <option key={s}>{s}</option>)}</select>
          <button onClick={book} className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white">Pay & Confirm</button>
        </div>
      </section>

      <section className="rounded-2xl border bg-card p-5">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Ratings & Reviews</h3>
          <button onClick={submitReview} className="rounded-full border px-3 py-1 text-xs">Leave quick review</button>
        </div>
        <div className="mt-3 space-y-2 text-sm">
          {reviews.filter((r) => r.mentorId === selectedMentor).map((r) => (
            <div key={r.id} className="rounded-xl border p-3">{r.rating}/5 · {r.comment}</div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border bg-card p-5">
        <h3 className="font-semibold">My Session Links</h3>
        <div className="mt-3 space-y-2 text-sm">
          {mySessions.filter((s) => s.mentorId === selectedMentor).map((s) => (
            <div key={s.id} className="rounded-xl border p-3">
              {s.status} · {s.meetingLink ? <a className="text-primary underline" href={s.meetingLink} target="_blank">Join link</a> : "Pending link"}
            </div>
          ))}
        </div>
      </section>

      {status ? <p className="text-sm">{status}</p> : null}
    </div>
  );
}
