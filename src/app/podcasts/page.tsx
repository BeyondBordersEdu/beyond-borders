import { PageShell } from "@/components/sections/page-shell";
import { PodcastPlatform } from "@/components/podcast/podcast-platform";

export default function Page() {
  return (
    <PageShell title="Podcast & Stories" copy="Community-driven study abroad journeys, visa experiences, and job tips.">
      <PodcastPlatform />
    </PageShell>
  );
}
