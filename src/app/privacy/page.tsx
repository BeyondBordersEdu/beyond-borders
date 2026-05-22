import { PageShell } from "@/components/sections/page-shell";

export default function Page() {
  return (
    <PageShell title="Privacy Policy" copy="GDPR-aligned data handling for global users.">
      <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
        <p>We collect profile, usage, and application data to provide personalized career services.</p>
        <p>You may request access, correction, deletion, and export of your personal data.</p>
        <p>Contact: privacy@beyond-borders.global</p>
      </div>
    </PageShell>
  );
}
