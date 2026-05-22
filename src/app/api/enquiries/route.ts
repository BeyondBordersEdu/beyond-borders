import { NextResponse } from "next/server";
import { z } from "zod";
import { repo } from "@/lib/server/repository";
import { sendEmail } from "@/lib/server/email";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  subject: z.string().min(3),
  message: z.string().min(5)
});

const ADMIN_EMAIL = "rakshithveerashaiva@aol.com";

export async function GET() {
  return NextResponse.json({ enquiries: await repo.getEnquiries() });
}

export async function POST(req: Request) {
  const payload = schema.parse(await req.json());
  const enquiry = await repo.createEnquiry(payload);

  await sendEmail({
    to: ADMIN_EMAIL,
    subject: `New Beyond Borders enquiry: ${enquiry.subject}`,
    html: `<p><strong>${enquiry.name}</strong> (${enquiry.email})</p><p>${enquiry.message}</p>`
  });

  return NextResponse.json({ ok: true, enquiry });
}
