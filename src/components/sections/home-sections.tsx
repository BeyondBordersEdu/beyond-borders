"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const mapData = {
  India: { jobs: 12420, scholarships: 1320, visas: "UAE Fast Track + EU Blue Card routes" },
  UAE: { jobs: 7400, scholarships: 220, visas: "Employment Visa + Golden Visa pathways" },
  Germany: { jobs: 6820, scholarships: 410, visas: "EU Blue Card + Skilled Migration" },
  Canada: { jobs: 9030, scholarships: 650, visas: "PGWP + Express Entry" },
  "United Kingdom": { jobs: 5210, scholarships: 560, visas: "Graduate Route + Skilled Worker" }
} as const;

type CountryKey = keyof typeof mapData;

const journey = [
  {
    title: "Where Most People Start",
    copy: "Too many tabs, too many opinions, and no clear next step."
  },
  {
    title: "What Changes Here",
    copy: "You get one clear plan: where to apply, what to improve, and what to do this week."
  },
  {
    title: "The Result",
    copy: "Less confusion, better decisions, and a faster move to global opportunities."
  }
];

export function HomeSections() {
  const [country, setCountry] = useState<CountryKey>("India");
  const [readiness, setReadiness] = useState(56);
  const [hovered, setHovered] = useState<CountryKey | null>(null);

  const activeCountry = hovered ?? country;
  const profile = mapData[activeCountry];

  const readinessSummary = useMemo(() => {
    if (readiness < 45) return "Foundation phase: build portfolio and interview basics.";
    if (readiness < 70) return "Acceleration phase: target scholarships and visa-sponsored shortlists.";
    return "Launch phase: execute high-fit applications and relocation prep.";
  }, [readiness]);

  return (
    <>
      <section className="container-xl pt-12 sm:pt-20">
        <div className="card-glass relative overflow-hidden px-8 py-16 sm:px-14 sm:py-24">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }}>
            <p className="type-caption">From Learning To Global Living</p>
            <h1 className="type-hero space-24 max-w-5xl">Your global career plan, finally made simple.</h1>
            <p className="type-body space-24 max-w-2xl">Built for students in India who want to study, work, and settle abroad with confidence.</p>
            <div className="space-32 flex flex-wrap gap-3">
              <Button asChild><Link href="/auth">Start Free</Link></Button>
              <Button asChild variant="secondary"><Link href="/dashboard">See Dashboard</Link></Button>
            </div>
          </motion.div>
          <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-sky-400/20 blur-3xl" />
          <div className="pointer-events-none absolute -left-24 -bottom-24 h-72 w-72 rounded-full bg-emerald-300/20 blur-3xl" />
        </div>
      </section>

      <section className="container-xl space-64">
        <div className="grid items-start gap-8 lg:grid-cols-5">
          <div className="lg:col-span-3 rounded-3xl border bg-card/70 p-8 backdrop-blur">
            <p className="type-caption">Country Snapshot</p>
            <h2 className="type-section space-16">Pick a country. See your options.</h2>
            <p className="type-body space-16">Start with India, then compare Gulf, Europe, and Canada routes in seconds.</p>

            <div className="space-32 grid gap-3 sm:grid-cols-3">
              {(Object.keys(mapData) as CountryKey[]).map((item) => (
                <button
                  key={item}
                  type="button"
                  onMouseEnter={() => setHovered(item)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => setCountry(item)}
                  className={`rounded-2xl border p-4 text-left transition ${activeCountry === item ? "border-primary bg-primary/10" : "bg-muted/40 hover:bg-muted/70"}`}
                >
                  <p className="font-semibold">{item}</p>
                  <p className="mt-1 text-xs text-slate-500">{mapData[item].jobs.toLocaleString()} openings</p>
                </button>
              ))}
            </div>
          </div>

          <aside className="card-glass p-8 lg:col-span-2">
            <p className="type-caption">{activeCountry}</p>
            <p className="space-16 text-3xl font-semibold tracking-tight">{profile.jobs.toLocaleString()} job openings</p>
            <p className="space-8 text-xl font-medium">{profile.scholarships.toLocaleString()} scholarship options</p>
            <p className="type-body space-24">{profile.visas}</p>
          </aside>
        </div>
      </section>

      <section className="container-xl space-64">
        <div className="rounded-3xl border bg-card/75 p-8 sm:p-12">
          <p className="type-caption">Career Readiness</p>
          <h2 className="type-section space-16">Check how ready you are today</h2>
          <div className="space-24">
            <input
              type="range"
              min={20}
              max={95}
              value={readiness}
              onChange={(e) => setReadiness(Number(e.target.value))}
              className="w-full accent-sky-500"
            />
            <div className="mt-4 flex items-center justify-between">
              <p className="text-4xl font-semibold tracking-tight">{readiness}%</p>
              <p className="type-body max-w-xl text-right">{readinessSummary}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="container-xl space-64">
        <div className="grid gap-4 md:grid-cols-3">
          {journey.map((item, idx) => (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ delay: idx * 0.1, duration: 0.45 }}
              className="rounded-3xl border bg-card/80 p-8"
            >
              <p className="type-caption">{idx + 1}</p>
              <h3 className="mt-3 text-xl font-semibold tracking-tight">{item.title}</h3>
              <p className="type-body mt-4">{item.copy}</p>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="container-xl space-64 pb-16 sm:pb-24">
        <div className="card-glass p-10 sm:p-14">
          <p className="type-caption">Real Outcomes</p>
          <h2 className="type-section space-16 max-w-4xl">Students from India are already building careers in Dubai, Munich, and Toronto.</h2>
          <p className="type-body space-16 max-w-2xl">Read simple, honest stories about what worked and what to avoid.</p>
          <div className="space-32 flex flex-wrap gap-3">
            <Button asChild><Link href="/success-stories">Read Stories</Link></Button>
            <Button asChild variant="secondary"><Link href="/book">Book a Call</Link></Button>
          </div>
        </div>
      </section>
    </>
  );
}
