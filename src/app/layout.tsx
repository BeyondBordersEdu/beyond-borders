import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { site } from "@/lib/site";
import { PersonalizationProvider } from "@/components/providers/personalization-provider";
import { AIAssistantWidget } from "@/components/experience/ai-assistant-widget";
import { StickyCTA } from "@/components/conversion/sticky-cta";
import { ExitIntentPopup } from "@/components/conversion/exit-intent-popup";
import { CookieConsent } from "@/components/legal/cookie-consent";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | ${site.tagline}`,
    template: `%s | ${site.name}`
  },
  description: site.description,
  openGraph: {
    title: site.name,
    description: site.description,
    url: site.url,
    siteName: site.name,
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: site.name,
    description: site.description
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body>
        <PersonalizationProvider>
          <Navbar />
          {children}
          <Footer />
          <AIAssistantWidget />
          <StickyCTA />
          <ExitIntentPopup />
          <CookieConsent />
        </PersonalizationProvider>
      </body>
    </html>
  );
}
