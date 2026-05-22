import { PageShell } from "@/components/sections/page-shell";
import { AdminInbox } from "@/components/admin/admin-inbox";

export default function Page() {
  return (
    <PageShell title="Admin Inbox" copy="Internal panel for bookings, enquiries, and user operations.">
      <AdminInbox />
    </PageShell>
  );
}
