import { PageShell } from "@/components/sections/page-shell";
import { MentorshipMarketplacePro } from "@/components/mentors/mentorship-marketplace-pro";

export default function Page() {
  return (
    <PageShell title="Mentorship Marketplace" copy="Student to mentor lifecycle: recommendations, booking, payment, session tracking, and reviews.">
      <MentorshipMarketplacePro />
    </PageShell>
  );
}
