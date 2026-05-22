import Link from "next/link";

export function UpgradeStrip() {
  return (
    <section className="rounded-2xl border bg-card p-5">
      <h3 className="text-lg font-semibold">Premium Growth Layer</h3>
      <p className="mt-1 text-sm text-slate-500">Unlock AI premium tools, mentor priority booking, and advanced job/scholarship signals.</p>
      <div className="mt-3 flex gap-2">
        <Link href="/pricing" className="rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-white">Upgrade to Premium</Link>
        <Link href="/employers" className="rounded-lg border px-3 py-2 text-sm">Employer Plan</Link>
      </div>
    </section>
  );
}
