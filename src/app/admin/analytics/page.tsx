import { PageShell } from "@/components/sections/page-shell";
import { OpsMetrics } from "@/components/analytics/ops-metrics";

export default function Page() {
  return (
    <PageShell title="Admin Analytics" copy="Business intelligence for community health, mentorship revenue, and moderation performance.">
      <OpsMetrics />
    </PageShell>
  );
}
