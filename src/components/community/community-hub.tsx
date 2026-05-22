"use client";

import { useEffect, useState } from "react";

type Post = { id: string; author: string; country: string; channel: string; title: string; body: string; likes: number; comments: { id: string; author: string; body: string }[]; createdAt: string };

const channels = ["Jobs", "Scholarships", "Visa Help", "Housing", "Interviews", "IELTS Prep"];
const countries = ["All", "United Kingdom", "Canada", "Germany", "India"];

export function CommunityHub() {
  const [channel, setChannel] = useState("Jobs");
  const [country, setCountry] = useState("All");
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/community/posts?channel=${encodeURIComponent(channel)}&country=${encodeURIComponent(country)}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setPosts(data.posts);
    } catch {
      setError("Failed to load posts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [channel, country]);

  const createPost = async () => {
    if (!title || !body) return;
    const spam = await fetch("/api/ai/spam-check", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text: `${title} ${body}` }) }).then((r) => r.json());
    if (spam.flagged) {
      setError(`Post blocked by moderation: ${spam.reason}`);
      return;
    }

    await fetch("/api/community/posts", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title, body, channel, country: country === "All" ? "India" : country }) });
    setTitle(""); setBody("");
    load();
  };

  const like = async (postId: string) => {
    await fetch("/api/community/posts", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ postId }) });
    load();
  };

  const report = async (postId: string) => {
    await fetch("/api/community/reports", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ postId, reason: "Potential misinformation" }) });
  };

  return (
    <div className="space-y-5">
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
        {channels.map((c) => <button key={c} onClick={() => setChannel(c)} className={`rounded-2xl border p-3 text-sm ${channel === c ? "bg-primary/10 border-primary" : ""}`}>{c}</button>)}
      </section>

      <section className="rounded-2xl border bg-card p-5">
        <div className="grid gap-2 sm:grid-cols-2">
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Post title" className="rounded-xl border bg-transparent p-2 text-sm" />
          <select value={country} onChange={(e) => setCountry(e.target.value)} className="rounded-xl border bg-transparent p-2 text-sm">{countries.map((c) => <option key={c}>{c}</option>)}</select>
        </div>
        <textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Share your question or insight..." className="mt-2 h-24 w-full rounded-xl border bg-transparent p-2 text-sm" />
        <button onClick={createPost} className="mt-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white">Publish Post</button>
      </section>

      {loading ? <div className="animate-pulse rounded-2xl border p-6">Loading community feed...</div> : null}
      {error ? <div className="rounded-2xl border border-red-400 p-4 text-sm text-red-500">{error}</div> : null}
      {!loading && !error && posts.length === 0 ? <div className="rounded-2xl border p-6 text-sm">No posts yet in this channel.</div> : null}

      <section className="space-y-3">
        {posts.map((post) => (
          <article key={post.id} className="rounded-2xl border bg-muted/20 p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-medium">{post.title}</p>
                <p className="mt-1 text-xs text-slate-500">{post.author} · Verified user · {post.country} · {new Date(post.createdAt).toLocaleDateString()}</p>
              </div>
              <span className="rounded-full border px-3 py-1 text-xs">{post.channel}</span>
            </div>
            <p className="mt-3 text-sm">{post.body}</p>
            <div className="mt-3 flex gap-2 text-xs">
              <button onClick={() => like(post.id)} className="rounded-full border px-3 py-1">▲ {post.likes}</button>
              <button onClick={() => report(post.id)} className="rounded-full border px-3 py-1">Report</button>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
