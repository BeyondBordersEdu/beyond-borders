"use client";

import { useEffect, useState } from "react";

type Episode = { id: string; title: string; category: "study_abroad" | "visa_experience" | "job_tips"; mediaType: "audio" | "video"; mediaUrl: string; author: string; likes: number };

export function PodcastPlatform() {
  const [category, setCategory] = useState("all");
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [form, setForm] = useState({ title: "", category: "study_abroad", mediaType: "audio", mediaUrl: "" });

  const load = async () => {
    const data = await fetch(`/api/podcasts?category=${category}`).then((r) => r.json());
    setEpisodes(data.episodes || []);
  };

  useEffect(() => { load(); }, [category]);

  const upload = async () => {
    await fetch("/api/podcasts", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setForm({ title: "", category: "study_abroad", mediaType: "audio", mediaUrl: "" });
    load();
  };

  const like = async (id: string) => {
    await fetch("/api/podcasts", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    load();
  };

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border bg-card p-5">
        <h3 className="font-semibold">Upload Story Episode</h3>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Episode title" className="rounded-xl border bg-transparent p-2 text-sm" />
          <input value={form.mediaUrl} onChange={(e) => setForm({ ...form, mediaUrl: e.target.value })} placeholder="Media URL" className="rounded-xl border bg-transparent p-2 text-sm" />
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as any })} className="rounded-xl border bg-transparent p-2 text-sm">
            <option value="study_abroad">Study Abroad Journeys</option>
            <option value="visa_experience">Visa Experiences</option>
            <option value="job_tips">Job Tips</option>
          </select>
          <select value={form.mediaType} onChange={(e) => setForm({ ...form, mediaType: e.target.value as any })} className="rounded-xl border bg-transparent p-2 text-sm">
            <option value="audio">Audio</option>
            <option value="video">Video</option>
          </select>
        </div>
        <button onClick={upload} className="mt-3 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white">Upload Episode</button>
      </section>

      <div className="flex gap-2 text-sm">
        {["all", "study_abroad", "visa_experience", "job_tips"].map((c) => (
          <button key={c} onClick={() => setCategory(c)} className={`rounded-full border px-3 py-1 ${category === c ? "border-primary bg-primary/10" : ""}`}>{c}</button>
        ))}
      </div>

      <section className="grid gap-3 md:grid-cols-2">
        {episodes.map((e) => (
          <article key={e.id} className="rounded-2xl border bg-card p-4">
            <p className="font-semibold">{e.title}</p>
            <p className="mt-1 text-xs text-slate-500">{e.category} · {e.mediaType} · {e.author}</p>
            <a className="mt-2 inline-block text-sm text-primary underline" href={e.mediaUrl} target="_blank">Open media</a>
            <div className="mt-3"><button onClick={() => like(e.id)} className="rounded-full border px-3 py-1 text-xs">♥ {e.likes}</button></div>
          </article>
        ))}
      </section>
    </div>
  );
}
