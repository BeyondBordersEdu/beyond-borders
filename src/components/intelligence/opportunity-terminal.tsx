"use client";

import { useEffect, useState } from "react";

type Insights = {
  jobsPostedLastHour: number;
  scholarshipsClosingThisWeek: number;
  visaPolicyUpdates: number;
  trendingSkills: string[];
};

export function OpportunityTerminal() {
  const [data, setData] = useState<Insights | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/insights", { cache: "no-store" });
      setData(await res.json());
    };
    fetchData();
    const timer = setInterval(fetchData, 15000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="rounded-2xl border bg-card p-5">
      <p className="text-xs font-semibold uppercase tracking-widest text-primary">Global Career Terminal</p>
      {!data ? (
        <p className="mt-3 text-sm">Syncing real-time intelligence...</p>
      ) : (
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 text-sm">
          <TerminalMetric label="Jobs (1h)" value={String(data.jobsPostedLastHour)} />
          <TerminalMetric label="Deadlines (7d)" value={String(data.scholarshipsClosingThisWeek)} />
          <TerminalMetric label="Visa Updates" value={String(data.visaPolicyUpdates)} />
          <TerminalMetric label="Skill Trends" value={data.trendingSkills.join(" · ")} />
        </div>
      )}
    </section>
  );
}

function TerminalMetric({ label, value }: { label: string; value: string }) {
  return <div className="rounded-xl border bg-muted/40 p-3"><p className="text-xs text-slate-500">{label}</p><p className="mt-1 font-semibold">{value}</p></div>;
}
