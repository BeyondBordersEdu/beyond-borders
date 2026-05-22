"use client";

import { useEffect, useState } from "react";

export function EngagementPanel() {
  const [progress, setProgress] = useState<any>(null);
  const [alerts, setAlerts] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/progress").then((r) => r.json()).then(setProgress);
    fetch("/api/notifications").then((r) => r.json()).then((d) => setAlerts(d.notifications || []));
  }, []);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <article className="rounded-xl border bg-card p-5">
        <h3 className="font-semibold">Career Score</h3>
        <p className="mt-2 text-3xl font-semibold">{progress?.careerScore ?? "--"}</p>
        <p className="mt-2 text-sm text-slate-500">Weekly report: {progress?.weeklyReport?.recommendation ?? "Loading..."}</p>
      </article>
      <article className="rounded-xl border bg-card p-5">
        <h3 className="font-semibold">Alert Center</h3>
        <div className="mt-3 space-y-2 text-sm">{alerts.map((a) => <div key={a.id} className="rounded-lg border p-2">{a.title}</div>)}</div>
      </article>
    </div>
  );
}
