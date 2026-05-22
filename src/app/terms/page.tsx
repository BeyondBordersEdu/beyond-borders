import { PageShell } from "@/components/sections/page-shell";

export default function Page() {
  return (
    <PageShell title="Terms of Service" copy="Service terms for Beyond Borders platform usage.">
      <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
        <p>By using Beyond Borders, you agree to lawful use and accurate profile information.</p>
        <p>Mentor sessions and premium subscriptions are billed according to selected plans.</p>
        <p>AI outputs are advisory and should be verified before legal/immigration submission.</p>
      </div>
    </PageShell>
  );
}
