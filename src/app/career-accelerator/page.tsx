"use client";

import { useEffect, useState } from "react";
import { PageShell } from "@/components/sections/page-shell";

const features = ["CV builder", "Resume analyzer", "ATS optimization", "Interview simulator", "LinkedIn optimizer", "Career assessment", "Skill gap analysis", "Career roadmap planner"];

export default function Page() {
  const [plan, setPlan] = useState<"free" | "pro" | "premium">("free");

  useEffect(() => {
    fetch("/api/user/profile").then((r) => r.json()).then((p) => setPlan(p.plan || "free")).catch(() => null);
  }, []);

  const locked = plan === "free";

  return (
    <PageShell title="Career Accelerator" copy="Tools to transform students into globally employable professionals.">
      {locked ? <div className="mb-4 rounded-xl border border-amber-400 bg-amber-100/30 p-4 text-sm">Upgrade to Pro to unlock AI resume analyzer, ATS optimization, and interview simulator.</div> : null}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((f, i) => (
          <div key={f} className={`rounded-xl border p-4 text-sm ${locked && i > 2 ? "opacity-50" : ""}`}>
            {f} {locked && i > 2 ? "(Pro+)" : ""}
          </div>
        ))}
      </div>
    </PageShell>
  );
}
