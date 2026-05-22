"use client";

import { useEffect, useState } from "react";
import { PageShell } from "@/components/sections/page-shell";
import { OpportunityTerminal } from "@/components/intelligence/opportunity-terminal";
import { useAppStore } from "@/lib/store";
import { EngagementPanel } from "@/components/engagement/engagement-panel";
import { ProgressChart } from "@/components/engagement/progress-chart";

type RoadmapData = { roadmap: string[]; skillGaps: string[]; recommendedJobs: string[] };
type VisaData = { score: number; factors: string[] };

type FeedData = { jobs: { total: number; visaSponsored: number }; scholarships: { total: number; closingSoon: number } };
type MentorRec = { id: string; name: string; score: number };
type ScholarshipRec = { id: string; title: string; score: number };

export default function Page() {
  const { profile, setProfile } = useAppStore();
  const [roadmap, setRoadmap] = useState<RoadmapData | null>(null);
  const [visa, setVisa] = useState<VisaData | null>(null);
  const [feed, setFeed] = useState<FeedData | null>(null);
  const [mentorRecs, setMentorRecs] = useState<MentorRec[]>([]);
  const [scholarshipRecs, setScholarshipRecs] = useState<ScholarshipRec[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [p, r, v, f, m, s] = await Promise.all([
          fetch("/api/user/profile").then((x) => x.json()),
          fetch("/api/ai/career-roadmap").then((x) => x.json()),
          fetch("/api/ai/visa-score").then((x) => x.json()),
          fetch("/api/market").then((x) => x.json()),
          fetch("/api/ai/mentor-recommendations").then((x) => x.json()),
          fetch("/api/ai/scholarship-finder").then((x) => x.json())
        ]);
        setProfile(p);
        setRoadmap(r);
        setVisa(v);
        setFeed(f);
        setMentorRecs((m.recommendations || []).slice(0, 3));
        setScholarshipRecs((s.matches || []).slice(0, 3));
      } catch {
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [setProfile]);

  if (loading) return <main className="container-xl py-14"><div className="animate-pulse rounded-2xl border p-10">Loading personalized dashboard...</div></main>;
  if (error) return <main className="container-xl py-14"><div className="rounded-2xl border border-red-400 p-10 text-red-500">{error}</div></main>;

  return (
    <PageShell title="Personalized Dashboard" copy={`Welcome ${profile?.name || "User"}. This workspace updates from real APIs and persistent user state.`}>
      <div className="space-y-5">
        <OpportunityTerminal />
        <EngagementPanel />
        <ProgressChart />
        <section className="grid gap-4 md:grid-cols-3">
          <Card title="Visa Readiness" value={`${visa?.score ?? 0}%`} />
          <Card title="Jobs (Visa Sponsored)" value={`${feed?.jobs.visaSponsored ?? 0}`} />
          <Card title="Scholarships Closing Soon" value={`${feed?.scholarships.closingSoon ?? 0}`} />
        </section>

        <section className="rounded-xl border bg-card p-5">
          <h3 className="font-semibold">AI Career Roadmap</h3>
          {!roadmap?.roadmap?.length ? <p className="mt-2 text-sm">No roadmap generated yet.</p> : (
            <ul className="mt-3 space-y-2 text-sm">{roadmap.roadmap.map((step) => <li key={step} className="rounded-lg border bg-muted/40 p-2">{step}</li>)}</ul>
          )}
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <article className="rounded-xl border bg-card p-5">
            <h3 className="font-semibold">Skill Gap Report</h3>
            <ul className="mt-3 space-y-2 text-sm">{roadmap?.skillGaps.map((g) => <li key={g} className="rounded-lg border p-2">{g}</li>)}</ul>
          </article>
          <article className="rounded-xl border bg-card p-5">
            <h3 className="font-semibold">AI Job Matches</h3>
            <ul className="mt-3 space-y-2 text-sm">{roadmap?.recommendedJobs.map((j) => <li key={j} className="rounded-lg border p-2">{j}</li>)}</ul>
          </article>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <article className="rounded-xl border bg-card p-5">
            <h3 className="font-semibold">AI Mentor Recommendations</h3>
            <ul className="mt-3 space-y-2 text-sm">{mentorRecs.map((m) => <li key={m.id} className="rounded-lg border p-2">{m.name} · Fit {m.score}%</li>)}</ul>
          </article>
          <article className="rounded-xl border bg-card p-5">
            <h3 className="font-semibold">AI Scholarship Finder</h3>
            <ul className="mt-3 space-y-2 text-sm">{scholarshipRecs.map((s) => <li key={s.id} className="rounded-lg border p-2">{s.title} · Match {s.score}%</li>)}</ul>
          </article>
        </section>
      </div>
    </PageShell>
  );
}

function Card({ title, value }: { title: string; value: string }) {
  return <article className="rounded-xl border bg-card p-4"><p className="text-xs text-slate-500">{title}</p><p className="mt-1 text-2xl font-semibold">{value}</p></article>;
}
