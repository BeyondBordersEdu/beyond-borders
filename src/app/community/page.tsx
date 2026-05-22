import { PageShell } from "@/components/sections/page-shell";
import { CommunityHub } from "@/components/community/community-hub";
import { OpportunityTerminal } from "@/components/intelligence/opportunity-terminal";

export default function Page() {
  return (
    <PageShell title="Community Ecosystem" copy="Reddit + Discord + LinkedIn style network for global career transitions.">
      <div className="space-y-5">
        <OpportunityTerminal />
        <CommunityHub />
      </div>
    </PageShell>
  );
}
