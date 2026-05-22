"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";

export function ExitIntentPopup() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (e.clientY <= 8) setOpen(true);
    };
    window.addEventListener("mouseout", handler);
    return () => window.removeEventListener("mouseout", handler);
  }, []);

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-[95] grid place-items-center bg-black/50 p-4" onClick={() => setOpen(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-2xl border bg-card p-6"
          >
            <h3 className="text-xl font-semibold">Before you go: want AI help?</h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">Beyond AI can instantly suggest scholarships, visa pathways, and jobs matched to your profile.</p>
            <div className="mt-5 flex gap-3">
              <Link href="/auth" className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white">Get My Plan</Link>
              <button type="button" onClick={() => setOpen(false)} className="rounded-lg border px-4 py-2 text-sm">Not now</button>
            </div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
