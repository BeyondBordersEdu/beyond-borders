"use client";

import Link from "next/link";

export function StickyCTA() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-[70] border-t bg-bg/90 backdrop-blur md:hidden">
      <div className="container-xl flex items-center justify-between py-3">
        <p className="text-xs">Get your AI career roadmap in 2 minutes.</p>
        <Link href="/auth" className="rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white">Start Free</Link>
      </div>
    </div>
  );
}
