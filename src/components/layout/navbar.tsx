import Link from "next/link";
import { site } from "@/lib/site";
import { Button } from "@/components/ui/button";

const nav = [
  { label: "Home", href: "/" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Mentors", href: "/mentorship-marketplace" },
  { label: "Community", href: "/community" },
  { label: "Pricing", href: "/pricing" }
] as const;

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-bg/70 backdrop-blur-2xl">
      <div className="container-xl flex h-20 items-center justify-between">
        <Link href="/" className="text-lg font-semibold tracking-[-0.02em]">{site.name}</Link>
        <nav className="hidden gap-7 text-sm lg:flex">
          {nav.map((item) => (
            <Link key={item.label} href={item.href} className="text-slate-600 transition hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">{item.label}</Link>
          ))}
        </nav>
        <div className="flex gap-2">
          <Button asChild variant="secondary"><Link href="/auth">Log in</Link></Button>
          <Button asChild><Link href="/auth">Get Started</Link></Button>
        </div>
      </div>
    </header>
  );
}
