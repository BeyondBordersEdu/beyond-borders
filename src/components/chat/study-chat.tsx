"use client";

import { useEffect, useState } from "react";

type Room = { id: string; slug: string; title: string; description: string };
type Message = { id: string; roomId: string; author: string; body: string; flagged: boolean; createdAt: string };

export function StudyChat() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomId, setRoomId] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [body, setBody] = useState("");
  const [status, setStatus] = useState("");

  const loadRooms = async () => {
    const data = await fetch("/api/study-chat/rooms").then((r) => r.json());
    setRooms(data.rooms || []);
    if (!roomId && data.rooms?.length) setRoomId(data.rooms[0].id);
  };

  const loadMessages = async (id: string) => {
    const data = await fetch(`/api/study-chat/messages?roomId=${id}`).then((r) => r.json());
    setMessages(data.messages || []);
  };

  useEffect(() => { loadRooms(); }, []);
  useEffect(() => { if (roomId) loadMessages(roomId); }, [roomId]);

  const send = async () => {
    if (!roomId || !body) return;
    const res = await fetch("/api/study-chat/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roomId, body })
    }).then((r) => r.json());

    setStatus(res.flagged ? "Message sent but flagged for moderation review." : "Message sent.");
    setBody("");
    loadMessages(roomId);
  };

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <aside className="rounded-2xl border bg-card p-4">
        <h3 className="font-semibold">Study Rooms</h3>
        <div className="mt-3 space-y-2">
          {rooms.map((r) => (
            <button key={r.id} onClick={() => setRoomId(r.id)} className={`w-full rounded-xl border p-3 text-left ${roomId === r.id ? "border-primary bg-primary/10" : ""}`}>
              <p className="text-sm font-medium">{r.title}</p>
              <p className="text-xs text-slate-500">{r.description}</p>
            </button>
          ))}
        </div>
      </aside>

      <section className="rounded-2xl border bg-card p-4 lg:col-span-2">
        <h3 className="font-semibold">Live Topic Chat</h3>
        <div className="mt-3 h-72 space-y-2 overflow-auto rounded-xl border bg-muted/20 p-3">
          {messages.map((m) => (
            <div key={m.id} className={`rounded-lg p-2 text-sm ${m.flagged ? "border border-amber-400 bg-amber-100/30" : "border"}`}>
              <p className="text-xs text-slate-500">{m.author}</p>
              <p>{m.body}</p>
            </div>
          ))}
        </div>
        <div className="mt-3 flex gap-2">
          <input value={body} onChange={(e) => setBody(e.target.value)} className="flex-1 rounded-xl border bg-transparent p-2 text-sm" placeholder="Ask about IELTS, visa docs, jobs..." />
          <button onClick={send} className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white">Send</button>
        </div>
        {status ? <p className="mt-2 text-xs text-slate-500">{status}</p> : null}
      </section>
    </div>
  );
}
