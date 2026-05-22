"use client";

import { useEffect, useState } from "react";
import { useAppStore } from "@/lib/store";

type Job = { id: string; title: string; country: string; salary: string; visaSponsored: boolean; employer: string; tags: string[]; description: string; score?: number };

export function JobsMarketplace() {
  const [country, setCountry] = useState("All");
  const [visaOnly, setVisaOnly] = useState(true);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { savedJobs, setSavedJobs } = useAppStore();

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/jobs?country=${encodeURIComponent(country)}&visaOnly=${visaOnly}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      const ranked = await fetch("/api/ai/job-match").then((r) => r.json());
      const scores = new Map(ranked.matches.map((m: Job) => [m.id, m.score]));
      setJobs(data.jobs.map((j: Job) => ({ ...j, score: scores.get(j.id) ?? 60 })));
      setSavedJobs(data.saved);
    } catch {
      setError("Failed to load jobs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [country, visaOnly]);

  const mutate = async (jobId: string, action: "save" | "apply") => {
    await fetch("/api/jobs", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ jobId, action }) });
    load();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 text-sm">
        {["All", "United Kingdom", "Canada", "Germany"].map((c) => <button key={c} onClick={() => setCountry(c)} className={`rounded-lg border px-3 py-2 ${country === c ? "border-primary bg-primary/10" : ""}`}>{c}</button>)}
        <label className="ml-auto flex items-center gap-2 rounded-lg border px-3 py-2"><input type="checkbox" checked={visaOnly} onChange={(e) => setVisaOnly(e.target.checked)} />Visa sponsorship</label>
      </div>

      {loading ? <div className="animate-pulse rounded-xl border p-6">Loading job marketplace...</div> : null}
      {error ? <div className="rounded-xl border border-red-400 p-4 text-sm text-red-500">{error}</div> : null}
      {!loading && !error && jobs.length === 0 ? <div className="rounded-xl border p-6 text-sm">No jobs found for selected filters.</div> : null}

      <div className="grid gap-3">
        {jobs.map((j) => (
          <article key={j.id} className="rounded-xl border bg-card p-4">
            <p className="font-semibold">{j.title}</p>
            <p className="mt-1 text-sm text-slate-500">{j.employer} · {j.country} · {j.salary} · AI match {j.score}%</p>
            <p className="mt-2 text-sm">{j.description}</p>
            <div className="mt-3 flex gap-2 text-sm">
              <button onClick={() => mutate(j.id, "save")} className="rounded-lg border px-3 py-2">{savedJobs.includes(j.id) ? "Saved" : "Save"}</button>
              <button onClick={() => mutate(j.id, "apply")} className="rounded-lg bg-primary px-3 py-2 font-semibold text-white">Apply</button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
