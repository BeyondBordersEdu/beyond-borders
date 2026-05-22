"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { usePersonalization } from "@/components/providers/personalization-provider";
import { countryData } from "@/lib/personalization";

export function AIAssistantWidget() {
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState("Hi, I am Beyond AI. Tell me your goal and I will build your next 7-day action plan.");
  const { profile } = usePersonalization();

  const submit = () => {
    const country = countryData[profile.country] ?? countryData["United Kingdom"];
    setReply(`For ${profile.interest} in ${profile.country}: prioritize ${country.hotSkills.join(", ")}. I found ${country.jobs.toLocaleString()} matched jobs and ${country.scholarships.toLocaleString()} scholarships. Next action: optimize CV for ${profile.goal} outcomes.`);
    setPrompt("");
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-5 right-5 z-[85] rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white shadow-glow"
      >
        Ask Beyond AI
      </button>

      <AnimatePresence>
        {open ? (
          <motion.aside
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="fixed bottom-20 right-5 z-[90] w-[22rem] rounded-2xl border bg-card p-4 shadow-2xl"
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">Beyond AI</p>
            <p className="mt-3 rounded-xl bg-muted/50 p-3 text-sm">{reply}</p>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ask about jobs, scholarships, visas, CV..."
              className="mt-3 h-24 w-full rounded-xl border bg-transparent p-2 text-sm"
            />
            <div className="mt-3 flex justify-end">
              <Button onClick={submit}>Generate</Button>
            </div>
          </motion.aside>
        ) : null}
      </AnimatePresence>
    </>
  );
}
