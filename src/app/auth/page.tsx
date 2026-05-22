"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const goals = ["study", "scholarship", "internship", "job", "migration"];
const countries = ["United Kingdom", "Canada", "Germany", "Australia", "UAE", "India"];

export default function AuthPage() {
  const router = useRouter();
  const [form, setForm] = useState({ goal: "job", country: "India", education: "Undergraduate", budget: "£15k-£30k", interest: "Software Engineering", timeline: "6 months" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/user/profile").then((r) => r.json()).then((d) => {
      setLoading(false);
      if (d?.onboardingCompleted) router.push("/dashboard");
      else setForm((prev) => ({ ...prev, ...d }));
    }).catch(() => { setLoading(false); setError("Could not load profile"); });
  }, [router]);

  const submit = async () => {
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/onboarding/save", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (!res.ok) throw new Error("Save failed");
      router.push("/dashboard");
    } catch {
      setError("Failed to save onboarding.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <main className="container-xl py-14"><div className="animate-pulse rounded-2xl border p-10">Loading your setup...</div></main>;

  return (
    <main className="container-xl py-14">
      <div className="rounded-2xl border bg-card p-8">
        <h1 className="text-3xl font-semibold">Let’s set up your plan</h1>
        <p className="mt-2 text-sm text-slate-500">Answer a few quick questions. We’ll do the rest.</p>
        {error ? <p className="mt-3 text-sm text-red-500">{error}</p> : null}
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <FieldSelect label="Goal" value={form.goal} onChange={(v) => setForm({ ...form, goal: v })} options={goals} />
          <FieldSelect label="Country" value={form.country} onChange={(v) => setForm({ ...form, country: v })} options={countries} />
          <FieldInput label="Education" value={form.education} onChange={(v) => setForm({ ...form, education: v })} />
          <FieldInput label="Budget" value={form.budget} onChange={(v) => setForm({ ...form, budget: v })} />
          <FieldInput label="Interest" value={form.interest} onChange={(v) => setForm({ ...form, interest: v })} />
          <FieldInput label="Timeline" value={form.timeline} onChange={(v) => setForm({ ...form, timeline: v })} />
        </div>
        <button disabled={saving} onClick={submit} className="mt-6 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white">{saving ? "Saving..." : "Continue"}</button>
      </div>
    </main>
  );
}

function FieldInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return <label className="text-sm"><span>{label}</span><input className="mt-1 w-full rounded-lg border bg-transparent p-2" value={value} onChange={(e) => onChange(e.target.value)} /></label>;
}

function FieldSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return <label className="text-sm"><span>{label}</span><select className="mt-1 w-full rounded-lg border bg-transparent p-2" value={value} onChange={(e) => onChange(e.target.value)}>{options.map((o) => <option key={o}>{o}</option>)}</select></label>;
}
