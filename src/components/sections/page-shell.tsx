import { ReactNode } from "react";

export function PageShell({ title, copy, children }: { title: string; copy: string; children?: ReactNode }) {
  return (
    <main className="container-xl py-14">
      <h1 className="type-section">{title}</h1>
      <p className="type-body mt-3 max-w-3xl">{copy}</p>
      <section className="mt-8 rounded-2xl border bg-card p-8">{children}</section>
    </main>
  );
}
