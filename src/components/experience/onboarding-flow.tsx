"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { usePersonalization } from "@/components/providers/personalization-provider";
import { defaultProfile, type UserGoal, type UserProfile } from "@/lib/personalization";

const goals: UserGoal[] = ["study", "scholarship", "internship", "job", "migration"];
const countries = ["United Kingdom", "Canada", "Australia", "Germany", "UAE", "India"];
const education = ["High School", "Undergraduate", "Postgraduate", "Professional"];
const budgets = ["< £10k", "£10k-£15k", "£15k-£30k", "£30k+"];
const interests = ["Software Engineering", "Business", "Healthcare", "Design", "Finance", "Marketing"];

export function OnboardingFlow() {
  const { hasCompletedOnboarding, completeOnboarding } = usePersonalization();
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<UserProfile>(defaultProfile);

  const steps = useMemo(() => [
    { label: "Goal", options: goals, key: "goal" as const },
    { label: "Country", options: countries, key: "country" as const },
    { label: "Education", options: education, key: "education" as const },
    { label: "Budget", options: budgets, key: "budget" as const },
    { label: "Career Interest", options: interests, key: "interest" as const }
  ], []);

  if (hasCompletedOnboarding) return null;

  const current = steps[step];

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-black/50 p-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 12, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.98 }}
          className="w-full max-w-2xl rounded-3xl border bg-card p-7 shadow-2xl"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Conversational Onboarding</p>
          <h2 className="mt-2 text-2xl font-semibold">Ask Beyond AI: What should we optimize first?</h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">Step {step + 1} of {steps.length}: choose your {current.label.toLowerCase()}.</p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {current.options.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setDraft((prev) => ({ ...prev, [current.key]: option }))}
                className={`rounded-xl border p-3 text-left text-sm transition ${String(draft[current.key]) === option ? "border-primary bg-primary/10" : "hover:bg-muted/50"}`}
              >
                {option}
              </button>
            ))}
          </div>

          <div className="mt-6 flex justify-between">
            <Button variant="secondary" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>Back</Button>
            {step < steps.length - 1 ? (
              <Button onClick={() => setStep((s) => s + 1)}>Continue</Button>
            ) : (
              <Button onClick={() => completeOnboarding(draft)}>Generate My Plan</Button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
