"use client";

import { useEffect, useState } from "react";

export function AdminInbox() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/overview").then((r) => r.json()).then((d) => { setData(d); setLoading(false); });
  }, []);

  if (loading) return <div className="animate-pulse rounded-xl border p-6">Loading admin inbox...</div>;

  return (
    <div className="space-y-4">
      <section className="grid gap-3 sm:grid-cols-3">
        <Card label="Users" value={String(data.users)} />
        <Card label="Bookings" value={String(data.bookings.length)} />
        <Card label="Enquiries" value={String(data.enquiries.length)} />
      </section>
      <section className="rounded-xl border bg-card p-4">
        <h3 className="font-semibold">Recent Enquiries</h3>
        <div className="mt-3 space-y-2 text-sm">{data.enquiries.map((e: any) => <div key={e.id} className="rounded-lg border p-2">{e.subject} · {e.email}</div>)}</div>
      </section>
      <section className="rounded-xl border bg-card p-4">
        <h3 className="font-semibold">Recent Bookings</h3>
        <div className="mt-3 space-y-2 text-sm">{data.bookings.map((b: any) => <div key={b.id} className="rounded-lg border p-2">{b.service} · {b.date} {b.time} · {b.status}</div>)}</div>
      </section>
    </div>
  );
}

function Card({ label, value }: { label: string; value: string }) {
  return <article className="rounded-xl border bg-card p-4"><p className="text-xs text-slate-500">{label}</p><p className="text-2xl font-semibold">{value}</p></article>;
}
