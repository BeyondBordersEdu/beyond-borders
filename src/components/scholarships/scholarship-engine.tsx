"use client";

import { useEffect, useState } from "react";
import { useAppStore } from "@/lib/store";

type Scholarship = { id: string; title: string; country: string; amount: string; deadline: string; tags: string[]; description: string };

export function ScholarshipEngine() {
  const [country, setCountry] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [items, setItems] = useState<Scholarship[]>([]);
  const { savedScholarships, setSavedScholarships } = useAppStore();

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/scholarships?country=${encodeURIComponent(country)}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setItems(data.scholarships);
      setSavedScholarships(data.saved);
    } catch {
      setError("Failed to load scholarships.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [country]);

  const save = async (scholarshipId: string) => {
    await fetch("/api/scholarships", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ scholarshipId }) });
    load();
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 text-sm">{["All", "United Kingdom", "Canada", "Germany"].map((c) => <button key={c} onClick={() => setCountry(c)} className={`rounded-lg border px-3 py-2 ${country === c ? "bg-primary/10 border-primary" : ""}`}>{c}</button>)}</div>
      {loading ? <div className="animate-pulse rounded-xl border p-6">Loading scholarships...</div> : null}
      {error ? <div className="rounded-xl border border-red-400 p-4 text-sm text-red-500">{error}</div> : null}
      {!loading && !error && items.length === 0 ? <div className="rounded-xl border p-6 text-sm">No scholarships found.</div> : null}
      <div className="space-y-3">
        {items.map((s) => (
          <article key={s.id} className="rounded-xl border bg-card p-4">
            <p className="font-semibold">{s.title}</p>
            <p className="mt-1 text-sm text-slate-500">{s.country} · {s.amount} · Deadline {s.deadline}</p>
            <p className="mt-2 text-sm">{s.description}</p>
            <button onClick={() => save(s.id)} className="mt-3 rounded-lg border px-3 py-2 text-sm">{savedScholarships.includes(s.id) ? "Saved" : "Save scholarship"}</button>
          </article>
        ))}
      </div>
    </div>
  );
}
