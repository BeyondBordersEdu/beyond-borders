"use client";

import { useEffect, useState } from "react";

type LiveData = {
  generatedAt: string;
  jobsPostedLastHour: number;
  scholarshipsClosingThisWeek: number;
  visaPolicyUpdates: number;
  trendingSkills: string[];
};

export function LiveDataTicker() {
  const [data, setData] = useState<LiveData | null>(null);

  useEffect(() => {
    let active = true;
    const load = async () => {
      const res = await fetch("/api/live", { cache: "no-store" });
      const json = (await res.json()) as LiveData;
      if (active) setData(json);
    };
    load();
    const id = setInterval(load, 20000);
    return () => {
      active = false;
      clearInterval(id);
    };
  }, []);

  if (!data) return <div className="rounded-xl border bg-card p-4 text-sm">Loading live market intelligence...</div>;

  return (
    <div className="rounded-xl border bg-card p-4 text-sm">
      <p className="font-semibold">Live Data Module</p>
      <p className="mt-1 text-slate-500 dark:text-slate-300">{data.jobsPostedLastHour} new jobs this hour · {data.scholarshipsClosingThisWeek} deadlines this week · {data.visaPolicyUpdates} visa updates</p>
      <p className="mt-2 text-xs text-slate-500">Trending skills: {data.trendingSkills.join(", ")}</p>
    </div>
  );
}
