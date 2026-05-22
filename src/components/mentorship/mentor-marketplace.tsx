"use client";

import { useEffect, useState } from "react";

type Mentor = { id: string; name: string; field: string; rating: number; sessions: number; country: string };

export function MentorMarketplace() {
  const [country, setCountry] = useState("All");
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    fetch(`/api/mentors?country=${encodeURIComponent(country)}`)
      .then((r) => r.json())
      .then((d) => { setMentors(d.mentors); setLoading(false); })
      .catch(() => { setError("Failed to load mentors."); setLoading(false); });
  }, [country]);

  return (
    <div className="space-y-4">
      <div className="flex gap-2 text-sm">{["All", "United Kingdom", "Canada"].map((c) => <button key={c} onClick={() => setCountry(c)} className={`rounded-lg border px-3 py-2 ${country === c ? "bg-primary/10 border-primary" : ""}`}>{c}</button>)}</div>
      {loading ? <div className="animate-pulse rounded-xl border p-6">Loading mentors...</div> : null}
      {error ? <div className="rounded-xl border border-red-400 p-4 text-sm text-red-500">{error}</div> : null}
      {!loading && !error && mentors.length === 0 ? <div className="rounded-xl border p-6 text-sm">No mentors found.</div> : null}
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {mentors.map((m) => (
          <article key={m.id} className="rounded-xl border bg-card p-4">
            <p className="font-semibold">{m.name}</p>
            <p className="mt-1 text-sm text-slate-500">{m.field} · {m.country}</p>
            <p className="mt-1 text-sm">{m.rating} rating · {m.sessions} sessions</p>
            <button className="mt-3 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-white">Book session</button>
          </article>
        ))}
      </div>
    </div>
  );
}
