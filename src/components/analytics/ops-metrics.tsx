"use client";

import { useEffect, useState } from "react";

export function OpsMetrics() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/overview").then((r) => r.json()),
      fetch("/api/mentors/sessions").then((r) => r.json()),
      fetch("/api/community/reports").then((r) => r.json())
    ]).then(([overview, sessions, reports]) => {
      const totalRevenue = (sessions.sessions || []).reduce((acc: number, s: any) => acc + s.amount, 0);
      const commission = (sessions.sessions || []).reduce((acc: number, s: any) => acc + s.platformCommissionAmount, 0);
      setData({ overview, sessions: sessions.sessions || [], reports: reports.reports || [], totalRevenue, commission });
    });
  }, []);

  if (!data) return <div className="animate-pulse rounded-2xl border p-6">Loading analytics...</div>;

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-4">
        <Metric label="Users" value={String(data.overview.users)} />
        <Metric label="Mentor GMV" value={`£${(data.totalRevenue / 100).toFixed(2)}`} />
        <Metric label="Commission" value={`£${(data.commission / 100).toFixed(2)}`} />
        <Metric label="Open Reports" value={String(data.reports.filter((r: any) => r.status === "open").length)} />
      </div>
      <section className="rounded-2xl border bg-card p-4 text-sm">
        <p className="font-semibold">Moderation Queue</p>
        <div className="mt-2 space-y-2">{data.reports.map((r: any) => <div key={r.id} className="rounded-lg border p-2">{r.reason} · Post {r.postId}</div>)}</div>
      </section>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return <article className="rounded-2xl border bg-card p-4"><p className="text-xs text-slate-500">{label}</p><p className="text-2xl font-semibold">{value}</p></article>;
}
