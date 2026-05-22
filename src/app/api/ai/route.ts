import { NextResponse } from "next/server";
import { z } from "zod";
import { generateBeyondPlan } from "@/lib/ai/beyond-engine";

const bodySchema = z.object({
  tool: z.string(),
  prompt: z.string().min(3),
  profile: z
    .object({
      goal: z.enum(["study", "scholarship", "internship", "job", "migration"]),
      country: z.string(),
      education: z.string(),
      budget: z.string(),
      interest: z.string()
    })
    .optional()
});

export async function POST(req: Request) {
  const parsed = bodySchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const plan = parsed.data.profile ? generateBeyondPlan(parsed.data.profile) : null;

  return NextResponse.json({
    tool: parsed.data.tool,
    summary: `Beyond AI processed prompt: ${parsed.data.prompt}`,
    plan,
    suggestions: ["Improve CV achievements", "Apply to scholarship shortlist", "Run mock interview"]
  });
}
