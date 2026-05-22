import { PageShell } from "@/components/sections/page-shell";
import { ScholarshipEngine } from "@/components/scholarships/scholarship-engine";

export default function Page() {
  return (
    <PageShell title="Scholarship Intelligence Engine" copy="AI eligibility, deadline tracking, and application planning by country.">
      <ScholarshipEngine />
    </PageShell>
  );
}
