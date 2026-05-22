import { PageShell } from "@/components/sections/page-shell";
import { PricingPlans } from "@/components/pricing/pricing-plans";

export default function Page() {
  return (
    <PageShell title="Pricing" copy="Choose a plan that matches your global career growth stage.">
      <PricingPlans />
    </PageShell>
  );
}
