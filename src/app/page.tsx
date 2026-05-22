import { HomeSections } from "@/components/sections/home-sections";
import Script from "next/script";

export default function HomePage() {
  return (
    <>
      <Script
        id="org-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Beyond Borders",
            url: "https://beyond-borders.global",
            slogan: "From Student to Global Professional.",
            sameAs: []
          })
        }}
      />
      <HomeSections />
    </>
  );
}
