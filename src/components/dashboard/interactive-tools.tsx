"use client";

import { useMemo, useState } from "react";
import { countryData } from "@/lib/personalization";

export function InteractiveTools() {
  const countries = Object.keys(countryData);
  const [left, setLeft] = useState(countries[0]);
  const [right, setRight] = useState(countries[1]);

  const compare = useMemo(() => {
    const a = countryData[left];
    const b = countryData[right];
    return { a, b };
  }, [left, right]);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <article className="rounded-xl border bg-card p-5">
        <h3 className="font-semibold">Interactive Roadmap Builder</h3>
        <div className="mt-3 grid gap-2 text-sm">
          {["Target Program", "Skill Credential", "Mentor Session", "Mock Interview", "Visa Checklist"].map((step, i) => (
            <label key={step} className="flex items-center gap-2 rounded-lg border bg-muted/40 p-2">
              <input type="checkbox" defaultChecked={i < 2} />
              <span>{step}</span>
            </label>
          ))}
        </div>
      </article>

      <article className="rounded-xl border bg-card p-5">
        <h3 className="font-semibold">Country Comparison Tool</h3>
        <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
          <select className="rounded-lg border bg-transparent p-2" value={left} onChange={(e) => setLeft(e.target.value)}>{countries.map((c) => <option key={c}>{c}</option>)}</select>
          <select className="rounded-lg border bg-transparent p-2" value={right} onChange={(e) => setRight(e.target.value)}>{countries.map((c) => <option key={c}>{c}</option>)}</select>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
          <div className="rounded-lg border p-2">{left}: {compare.a.jobs.toLocaleString()} jobs · {compare.a.scholarships.toLocaleString()} scholarships</div>
          <div className="rounded-lg border p-2">{right}: {compare.b.jobs.toLocaleString()} jobs · {compare.b.scholarships.toLocaleString()} scholarships</div>
        </div>
      </article>
    </div>
  );
}
