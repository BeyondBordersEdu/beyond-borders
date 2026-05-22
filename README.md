# Beyond Borders

Beyond Borders is an AI-powered global student career operating system.

## Stack
- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS + Framer Motion
- NextAuth
- Prisma + PostgreSQL
- Supabase (data + policies)
- Stripe (checkout + webhook)
- Resend (emails)

## Local Start
1. Copy `.env.example` to `.env`.
2. Install deps: `npm install`
3. Start: `npm run dev`

## Production Activation Checklist
1. Provision Supabase and run SQL schema:
   - Apply [supabase/schema.sql](/Users/rakshu/Documents/Beyond Borders/supabase/schema.sql)
2. Set environment variables:
   - `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`
   - `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
   - `RESEND_API_KEY`, `EMAIL_FROM`
   - `NEXT_PUBLIC_APP_URL`, `REMINDER_CRON_SECRET`
3. Configure Stripe webhook:
   - Endpoint: `https://YOUR_DOMAIN/api/stripe/webhook`
   - Event: `checkout.session.completed`
4. Configure reminder trigger job:
   - POST `https://YOUR_DOMAIN/api/mentors/reminders`
   - Header: `x-reminder-secret: REMINDER_CRON_SECRET`
5. Run readiness checks:
   - `bash scripts/go-live-check.sh https://YOUR_DOMAIN`
   - Or locally: `bash scripts/go-live-check.sh`

## Core API Modules
- User/profile: `/api/user/profile`, `/api/onboarding/save`
- Jobs/scholarships/mentors: `/api/jobs`, `/api/scholarships`, `/api/mentors`
- Community: `/api/community/posts`, `/api/community/reports`
- Mentorship lifecycle: `/api/bookings`, `/api/mentors/sessions`, `/api/mentors/reviews`
- Content + chat: `/api/podcasts`, `/api/study-chat/rooms`, `/api/study-chat/messages`
- AI services: `/api/ai/*`
- Ops checks: `/api/ops/readiness`

## Notes
- APIs are Supabase-first with safe file-backed fallback for local development.
- Email sending uses Resend when configured; otherwise local logging fallback.
- Stripe checkout uses real sessions when keys are configured; otherwise simulated redirect for localhost testing.
