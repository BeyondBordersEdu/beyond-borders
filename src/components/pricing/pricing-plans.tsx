"use client";

import { useEffect, useState } from "react";

type Plan = "free" | "pro" | "premium";

const plans: { id: Plan; name: string; price: string; features: string[] }[] = [
  { id: "free", name: "Free", price: "£0", features: ["Basic dashboard", "Community access", "3 job saves"] },
  { id: "pro", name: "Pro", price: "£29/mo", features: ["AI job matching", "Scholarship ranking", "10 mentor discounts"] },
  { id: "premium", name: "Premium", price: "£79/mo", features: ["Unlimited AI tools", "Priority mentor booking", "Visa strategy calls"] }
];

export function PricingPlans() {
  const [plan, setPlan] = useState<Plan>("free");

  useEffect(() => {
    fetch("/api/user/profile").then((r) => r.json()).then((p) => setPlan(p.plan || "free")).catch(() => null);
  }, []);

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {plans.map((p) => (
        <article key={p.id} className={`rounded-2xl border p-6 ${plan === p.id ? "border-primary bg-primary/10" : "bg-card"}`}>
          <p className="text-sm font-semibold text-primary">{p.name}</p>
          <p className="mt-2 text-3xl font-semibold">{p.price}</p>
          <ul className="mt-4 space-y-2 text-sm">{p.features.map((f) => <li key={f}>• {f}</li>)}</ul>
          <button className="mt-5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white">{plan === p.id ? "Current Plan" : "Upgrade"}</button>
        </article>
      ))}
    </div>
  );
}
