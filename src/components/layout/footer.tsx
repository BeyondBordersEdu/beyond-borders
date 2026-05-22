import Link from "next/link";

const links = [
  { label: "About", href: "/about" },
  { label: "Pricing", href: "/pricing" },
  { label: "Mentors", href: "/mentorship-marketplace" },
  { label: "Community", href: "/community" },
  { label: "Contact", href: "/contact" },
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" }
] as const;

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border py-12">
      <div className="container-xl grid gap-8 md:grid-cols-2">
        <div>
          <h3 className="text-xl font-semibold">Beyond Borders</h3>
          <p className="mt-2 text-slate-500 dark:text-slate-300">From Student to Global Professional.</p>
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-300">Clear guidance for study, jobs, and migration. Built for real outcomes.</p>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          {links.map((link) => (
            <Link key={link.label} href={link.href} className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">{link.label}</Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
