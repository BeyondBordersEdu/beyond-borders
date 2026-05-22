"use client";

import { useState } from "react";
import { countryData, deriveCareerLevel } from "@/lib/personalization";
import { usePersonalization } from "@/components/providers/personalization-provider";

type Block = { id: string; label: string };

export function DashboardOverview() {
  const { profile } = usePersonalization();
  const selected = countryData[profile.country] ?? countryData["United Kingdom"];
  const [xp] = useState(1280);
  const [streak] = useState(9);
  const [visaScore] = useState(72);
  const [jobs] = useState([
    { id: 1, role: "Junior Product Analyst", country: profile.country, visa: true },
    { id: 2, role: "Graduate Software Engineer", country: "Canada", visa: true },
    { id: 3, role: "Data Operations Associate", country: "Germany", visa: false }
  ]);

  const [index, setIndex] = useState(0);
  const [blocks, setBlocks] = useState<Block[]>([
    { id: "summary", label: "Professional Summary" },
    { id: "impact", label: "Impact Metrics" },
    { id: "projects", label: "Projects" },
    { id: "skills", label: "Skills" }
  ]);

  const reorder = (from: number, to: number) => {
    if (from === to) return;
    const copy = [...blocks];
    const [item] = copy.splice(from, 1);
    copy.splice(to, 0, item);
    setBlocks(copy);
  };

  const level = deriveCareerLevel(xp);

  return (
    <div className="space-y-6">
      <section className="grid gap-4 lg:grid-cols-4">
        <Metric title="Career Level" value={level} note={`${xp} XP`} />
        <Metric title="Visa Readiness" value={`${visaScore}%`} note={selected.visaPathway} />
        <Metric title="Current Streak" value={`${streak} days`} note="Keep momentum" />
        <Metric title="Weekly Goal" value="6/8 tasks" note="2 remaining" />
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <article className="rounded-xl border bg-card p-5 lg:col-span-2">
          <h3 className="font-semibold">Skill Gap Analysis</h3>
          <div className="mt-4 space-y-3 text-sm">
            {[
              ["Technical Interview", 62],
              ["Portfolio Strength", 48],
              ["System Design", 37],
              ["Networking", 74]
            ].map(([label, pct]) => (
              <div key={String(label)}>
                <div className="mb-1 flex justify-between"><span>{String(label)}</span><span>{pct}%</span></div>
                <div className="h-2 rounded-full bg-muted"><div className="h-2 rounded-full bg-primary" style={{ width: `${pct}%` }} /></div>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-xl border bg-card p-5">
          <h3 className="font-semibold">AI Recommendations</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
            <li>1. Add quantified outcomes to CV bullet points.</li>
            <li>2. Prioritize {selected.hotSkills[0]} and {selected.hotSkills[1]} certifications.</li>
            <li>3. Apply to 5 visa-sponsored roles by Friday.</li>
            <li>4. Book one mentor session for mock interview.</li>
          </ul>
        </article>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-xl border bg-card p-5">
          <h3 className="font-semibold">Swipe Job Discovery</h3>
          <div className="mt-4 rounded-xl border bg-muted/40 p-4">
            <p className="text-xs text-slate-500">Opportunity {index + 1}/{jobs.length}</p>
            <p className="mt-1 text-lg font-semibold">{jobs[index].role}</p>
            <p className="text-sm">{jobs[index].country} · {jobs[index].visa ? "Visa Sponsored" : "No sponsorship"}</p>
            <div className="mt-4 flex gap-2">
              <button type="button" className="rounded-lg border px-3 py-2 text-sm" onClick={() => setIndex((v) => (v + 1) % jobs.length)}>Skip</button>
              <button type="button" className="rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-white" onClick={() => setIndex((v) => (v + 1) % jobs.length)}>Save + Apply</button>
            </div>
          </div>
        </article>

        <article className="rounded-xl border bg-card p-5">
          <h3 className="font-semibold">Drag-and-Drop CV Builder</h3>
          <p className="mt-1 text-xs text-slate-500">Reorder sections to optimize ATS flow.</p>
          <div className="mt-3 space-y-2">
            {blocks.map((block, i) => (
              <div key={block.id} className="flex items-center justify-between rounded-lg border bg-muted/40 px-3 py-2 text-sm">
                <span>{block.label}</span>
                <div className="flex gap-2">
                  <button type="button" className="rounded border px-2" onClick={() => reorder(i, Math.max(i - 1, 0))}>↑</button>
                  <button type="button" className="rounded border px-2" onClick={() => reorder(i, Math.min(i + 1, blocks.length - 1))}>↓</button>
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="rounded-xl border bg-card p-5">
        <h3 className="font-semibold">Weekly Progress Insights</h3>
        <div className="mt-3 grid gap-3 md:grid-cols-4 text-sm">
          <Insight title="Applications" value="+11" />
          <Insight title="Interview Score" value="+14%" />
          <Insight title="Scholarship Fit" value="+9%" />
          <Insight title="Visa Readiness" value="+6%" />
        </div>
      </section>
    </div>
  );
}

function Metric({ title, value, note }: { title: string; value: string; note: string }) {
  return (
    <article className="rounded-xl border bg-card p-4">
      <p className="text-xs text-slate-500">{title}</p>
      <p className="mt-1 text-2xl font-semibold">{value}</p>
      <p className="mt-1 text-xs text-slate-500">{note}</p>
    </article>
  );
}

function Insight({ title, value }: { title: string; value: string }) {
  return <div className="rounded-lg border bg-muted/40 p-3"><p className="text-xs text-slate-500">{title}</p><p className="text-lg font-semibold">{value}</p></div>;
}
