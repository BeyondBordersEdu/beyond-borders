"use client";

import { useState } from "react";
import { PageShell } from "@/components/sections/page-shell";

export default function Page() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    setStatus("");
    try {
      const res = await fetch("/api/enquiries", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (!res.ok) throw new Error();
      setStatus("Enquiry submitted successfully. Our team has been notified.");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch {
      setStatus("Could not submit enquiry.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell title="Contact" copy="Talk to our global admissions and career operations team.">
      <div className="grid gap-3">
        <input className="rounded-lg border bg-transparent p-2" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input className="rounded-lg border bg-transparent p-2" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input className="rounded-lg border bg-transparent p-2" placeholder="Subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
        <textarea className="h-32 rounded-lg border bg-transparent p-2" placeholder="Message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
        <button disabled={loading} onClick={submit} className="w-fit rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white">{loading ? "Sending..." : "Send enquiry"}</button>
        {status ? <p className="text-sm">{status}</p> : null}
      </div>
    </PageShell>
  );
}
