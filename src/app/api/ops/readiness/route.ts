import { NextResponse } from "next/server";

const required = [
  "DATABASE_URL",
  "SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",
  "RESEND_API_KEY",
  "EMAIL_FROM",
  "NEXT_PUBLIC_APP_URL"
] as const;

export async function GET() {
  const checks = required.map((key) => ({ key, present: Boolean(process.env[key]) }));
  const missing = checks.filter((c) => !c.present).map((c) => c.key);

  return NextResponse.json({
    ready: missing.length === 0,
    checks,
    missing,
    timestamp: new Date().toISOString()
  });
}
