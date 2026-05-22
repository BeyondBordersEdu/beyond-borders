import { PageShell } from "@/components/sections/page-shell";
import { StudyChat } from "@/components/chat/study-chat";

export default function Page() {
  return (
    <PageShell title="24/7 Study Chat" copy="AI + human hybrid moderated chat rooms for IELTS, visa, and jobs support.">
      <StudyChat />
    </PageShell>
  );
}
