import { NextResponse } from "next/server";

const blocked = ["whatsapp me", "guaranteed visa", "pay me first", "crypto"]; 

export async function POST(req: Request) {
  const { text } = (await req.json()) as { text: string };
  const normalized = text.toLowerCase();
  const hit = blocked.find((w) => normalized.includes(w));
  return NextResponse.json({ flagged: Boolean(hit), reason: hit ? `Matched phrase: ${hit}` : null, confidence: hit ? 0.88 : 0.14 });
}
