import { PageShell } from "@/components/sections/page-shell";
import { JobsMarketplace } from "@/components/jobs/jobs-marketplace";

export default function Page() {
  return (
    <PageShell title="Sponsored Jobs Marketplace" copy="Visa-sponsored opportunities with AI matching and one-click applications.">
      <JobsMarketplace />
    </PageShell>
  );
}
