import { Resend } from "resend";

const resendKey = process.env.RESEND_API_KEY;
const from = process.env.EMAIL_FROM || "Beyond Borders <no-reply@beyond-borders.global>";
const resend = resendKey ? new Resend(resendKey) : null;

export async function sendEmail(opts: { to: string; subject: string; html: string }) {
  if (!resend) {
    console.log("[email-fallback]", opts.subject, "->", opts.to);
    return { id: "local-fallback" };
  }
  return resend.emails.send({ from, to: opts.to, subject: opts.subject, html: opts.html });
}
