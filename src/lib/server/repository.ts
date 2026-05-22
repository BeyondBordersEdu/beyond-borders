import { createClient } from "@supabase/supabase-js";
import { readDB, writeDB } from "@/lib/server/mock-db";
import type { Application, Booking, CommunityPost, Enquiry, Job, Mentor, Scholarship, UserNotification, UserProfile } from "@/types/platform";

const DEFAULT_USER_ID = "demo-user";
const uid = (userId?: string) => userId || DEFAULT_USER_ID;

function supabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

export const repo = {
  async getProfile(userId?: string): Promise<UserProfile | null> {
    const user = uid(userId);
    const sb = supabase();
    if (sb) {
      const { data } = await sb.from("profiles").select("*").eq("user_id", user).single();
      return data ? mapProfile(data) : null;
    }
    const db = await readDB();
    return db.profiles.find((p) => p.userId === user) ?? null;
  },

  async saveOnboarding(payload: Pick<UserProfile, "goal" | "country" | "education" | "budget" | "interest" | "timeline">, userId?: string) {
    const user = uid(userId);
    const sb = supabase();
    if (sb) {
      await sb.from("profiles").upsert({ user_id: user, ...payload, onboarding_completed: true }, { onConflict: "user_id" });
      return this.getProfile(user);
    }
    const db = await readDB();
    const i = db.profiles.findIndex((p) => p.userId === user);
    if (i >= 0) db.profiles[i] = { ...db.profiles[i], ...payload, onboardingCompleted: true };
    await writeDB(db);
    return db.profiles[i] ?? null;
  },

  async getJobs(country?: string | null, visaOnly = false, userId?: string): Promise<{ jobs: Job[]; saved: string[] }> {
    const user = uid(userId);
    const sb = supabase();
    if (sb) {
      let q = sb.from("jobs").select("*");
      if (country && country !== "All") q = q.eq("country", country);
      if (visaOnly) q = q.eq("visa_sponsored", true);
      const [{ data: jobsData }, { data: apps }] = await Promise.all([
        q,
        sb.from("applications").select("target_id").eq("user_id", user).eq("type", "job")
      ]);
      return { jobs: (jobsData ?? []).map(mapJob), saved: (apps ?? []).map((a: any) => a.target_id) };
    }
    const db = await readDB();
    const jobs = db.jobs.filter((j) => (!country || country === "All" || j.country === country) && (!visaOnly || j.visaSponsored));
    const saved = db.applications.filter((a) => a.userId === user && a.type === "job").map((a) => a.targetId);
    return { jobs, saved };
  },

  async saveJob(jobId: string, action: "save" | "apply", userId?: string) {
    const user = uid(userId);
    const sb = supabase();
    if (sb) {
      await sb.from("applications").upsert({ user_id: user, type: "job", target_id: jobId, status: action === "apply" ? "applied" : "saved" });
      return;
    }
    const db = await readDB();
    const existing = db.applications.find((a) => a.userId === user && a.type === "job" && a.targetId === jobId);
    if (existing) existing.status = action === "apply" ? "applied" : existing.status;
    else db.applications.push({ id: crypto.randomUUID(), userId: user, type: "job", targetId: jobId, status: action === "apply" ? "applied" : "saved", createdAt: new Date().toISOString() });
    await writeDB(db);
  },

  async getScholarships(country?: string | null, userId?: string): Promise<{ scholarships: Scholarship[]; saved: string[] }> {
    const user = uid(userId);
    const sb = supabase();
    if (sb) {
      let q = sb.from("scholarships").select("*");
      if (country && country !== "All") q = q.eq("country", country);
      const [{ data: scholarshipsData }, { data: apps }] = await Promise.all([
        q,
        sb.from("applications").select("target_id").eq("user_id", user).eq("type", "scholarship")
      ]);
      return { scholarships: (scholarshipsData ?? []).map(mapScholarship), saved: (apps ?? []).map((a: any) => a.target_id) };
    }
    const db = await readDB();
    const scholarships = db.scholarships.filter((s) => !country || country === "All" || s.country === country);
    const saved = db.applications.filter((a) => a.userId === user && a.type === "scholarship").map((a) => a.targetId);
    return { scholarships, saved };
  },

  async saveScholarship(scholarshipId: string, userId?: string) {
    const user = uid(userId);
    const sb = supabase();
    if (sb) {
      await sb.from("applications").upsert({ user_id: user, type: "scholarship", target_id: scholarshipId, status: "saved" });
      return;
    }
    const db = await readDB();
    if (!db.applications.some((a) => a.userId === user && a.type === "scholarship" && a.targetId === scholarshipId)) {
      db.applications.push({ id: crypto.randomUUID(), userId: user, type: "scholarship", targetId: scholarshipId, status: "saved", createdAt: new Date().toISOString() });
      await writeDB(db);
    }
  },

  async getMentors(country?: string | null): Promise<Mentor[]> {
    const sb = supabase();
    if (sb) {
      let q = sb.from("mentors").select("*");
      if (country && country !== "All") q = q.eq("country", country);
      const { data } = await q;
      return (data ?? []).map(mapMentor);
    }
    const db = await readDB();
    return db.mentors.filter((m) => !country || country === "All" || m.country === country);
  },

  async getPosts(country?: string | null, channel?: string | null): Promise<CommunityPost[]> {
    const sb = supabase();
    if (sb) {
      let q = sb.from("community_posts").select("*").order("created_at", { ascending: false });
      if (country && country !== "All") q = q.eq("country", country);
      if (channel) q = q.eq("channel", channel);
      const { data } = await q;
      return (data ?? []).map(mapPost);
    }
    const db = await readDB();
    return db.posts.filter((p) => (!country || country === "All" || p.country === country) && (!channel || p.channel === channel));
  },

  async createPost(payload: { title: string; body: string; channel: string; country: string }, userId?: string) {
    const user = uid(userId);
    const sb = supabase();
    if (sb) {
      await sb.from("community_posts").insert({ user_id: user, author: "Demo User", likes: 0, comments: [], created_at: new Date().toISOString(), ...payload });
      return;
    }
    const db = await readDB();
    db.posts.unshift({ id: crypto.randomUUID(), userId: user, author: "Demo User", likes: 0, comments: [], createdAt: new Date().toISOString(), ...payload });
    await writeDB(db);
  },

  async likePost(postId: string) {
    const sb = supabase();
    if (sb) {
      const { data } = await sb.from("community_posts").select("likes").eq("id", postId).single();
      await sb.from("community_posts").update({ likes: (data?.likes ?? 0) + 1 }).eq("id", postId);
      return;
    }
    const db = await readDB();
    const post = db.posts.find((p) => p.id === postId);
    if (post) post.likes += 1;
    await writeDB(db);
  },

  async getBookings(): Promise<Booking[]> {
    const sb = supabase();
    if (sb) {
      const { data } = await sb.from("bookings").select("*").order("created_at", { ascending: false });
      return (data ?? []).map(mapBooking);
    }
    const db = await readDB();
    return db.bookings;
  },

  async createBooking(payload: Omit<Booking, "id" | "userId" | "createdAt" | "status"> & { status?: Booking["status"] }, userId?: string): Promise<Booking> {
    const user = uid(userId);
    const booking: Booking = { id: crypto.randomUUID(), userId: user, status: payload.status ?? "pending", createdAt: new Date().toISOString(), ...payload };
    const sb = supabase();
    if (sb) {
      await sb.from("bookings").insert(mapBookingToRow(booking));
      return booking;
    }
    const db = await readDB();
    db.bookings.unshift(booking);
    await writeDB(db);
    return booking;
  },

  async updateBookingStatus(bookingId: string, status: Booking["status"]): Promise<Booking | null> {
    const sb = supabase();
    if (sb) {
      const { data } = await sb.from("bookings").update({ status }).eq("id", bookingId).select("*").single();
      return data ? mapBooking(data) : null;
    }
    const db = await readDB();
    const booking = db.bookings.find((b) => b.id === bookingId) ?? null;
    if (!booking) return null;
    booking.status = status;
    await writeDB(db);
    return booking;
  },

  async getEnquiries(): Promise<Enquiry[]> {
    const sb = supabase();
    if (sb) {
      const { data } = await sb.from("enquiries").select("*").order("created_at", { ascending: false });
      return (data ?? []).map(mapEnquiry);
    }
    const db = await readDB();
    return db.enquiries;
  },

  async createEnquiry(payload: Omit<Enquiry, "id" | "createdAt" | "status">): Promise<Enquiry> {
    const enquiry: Enquiry = { id: crypto.randomUUID(), createdAt: new Date().toISOString(), status: "new", ...payload };
    const sb = supabase();
    if (sb) {
      await sb.from("enquiries").insert(mapEnquiryToRow(enquiry));
      return enquiry;
    }
    const db = await readDB();
    db.enquiries.unshift(enquiry);
    await writeDB(db);
    return enquiry;
  },

  async getNotifications(userId?: string): Promise<UserNotification[]> {
    const user = uid(userId);
    const sb = supabase();
    if (sb) {
      const { data } = await sb.from("notifications").select("*").eq("user_id", user).order("created_at", { ascending: false });
      return (data ?? []).map(mapNotification);
    }
    const db = await readDB();
    return db.notifications.filter((n) => n.userId === user);
  },

  async getMentorSessions() {
    const sb = supabase();
    if (sb) {
      const { data } = await sb.from("mentor_sessions").select("*").order("created_at", { ascending: false });
      return (data ?? []).map((s: any) => ({
        id: s.id, mentorId: s.mentor_id, studentUserId: s.student_user_id, bookingId: s.booking_id, status: s.status,
        amount: s.amount, commissionPercent: s.commission_percent, platformCommissionAmount: s.platform_commission_amount,
        mentorPayoutAmount: s.mentor_payout_amount, meetingLink: s.meeting_link ?? undefined, reminderSentAt: s.reminder_sent_at ?? null, createdAt: s.created_at
      }));
    }
    const db = await readDB();
    return db.mentorSessions;
  },

  async createMentorSession(payload: { mentorId: string; bookingId: string; amount: number; commissionPercent: number; meetingLink?: string }, userId?: string) {
    const user = uid(userId);
    const platformCommissionAmount = Math.round((payload.amount * payload.commissionPercent) / 100);
    const session = {
      id: crypto.randomUUID(),
      mentorId: payload.mentorId,
      studentUserId: user,
      bookingId: payload.bookingId,
      status: "booked" as const,
      amount: payload.amount,
      commissionPercent: payload.commissionPercent,
      platformCommissionAmount,
      mentorPayoutAmount: payload.amount - platformCommissionAmount,
      meetingLink: payload.meetingLink,
      reminderSentAt: null,
      createdAt: new Date().toISOString()
    };
    const sb = supabase();
    if (sb) {
      await sb.from("mentor_sessions").insert({
        id: session.id, mentor_id: session.mentorId, student_user_id: session.studentUserId, booking_id: session.bookingId, status: session.status,
        amount: session.amount, commission_percent: session.commissionPercent, platform_commission_amount: session.platformCommissionAmount,
        mentor_payout_amount: session.mentorPayoutAmount, meeting_link: session.meetingLink, reminder_sent_at: session.reminderSentAt, created_at: session.createdAt
      });
      return session;
    }
    const db = await readDB();
    db.mentorSessions.unshift(session);
    await writeDB(db);
    return session;
  },

  async markSessionReminderSent(sessionId: string) {
    const sb = supabase();
    if (sb) {
      await sb.from("mentor_sessions").update({ reminder_sent_at: new Date().toISOString() }).eq("id", sessionId);
      return;
    }
    const db = await readDB();
    const s = db.mentorSessions.find((x) => x.id === sessionId);
    if (s) s.reminderSentAt = new Date().toISOString();
    await writeDB(db);
  },

  async getMentorReviews(mentorId?: string | null) {
    const sb = supabase();
    if (sb) {
      let q = sb.from("mentor_reviews").select("*").order("created_at", { ascending: false });
      if (mentorId) q = q.eq("mentor_id", mentorId);
      const { data } = await q;
      return (data ?? []).map((r: any) => ({ id: r.id, mentorId: r.mentor_id, userId: r.user_id, rating: r.rating, comment: r.comment, createdAt: r.created_at }));
    }
    const db = await readDB();
    return mentorId ? db.mentorReviews.filter((r) => r.mentorId === mentorId) : db.mentorReviews;
  },

  async createMentorReview(payload: { mentorId: string; rating: number; comment: string }, userId?: string) {
    const user = uid(userId);
    const review = { id: crypto.randomUUID(), mentorId: payload.mentorId, userId: user, rating: payload.rating, comment: payload.comment, createdAt: new Date().toISOString() };
    const sb = supabase();
    if (sb) {
      await sb.from("mentor_reviews").insert({ id: review.id, mentor_id: review.mentorId, user_id: review.userId, rating: review.rating, comment: review.comment, created_at: review.createdAt });
      return;
    }
    const db = await readDB();
    db.mentorReviews.unshift(review);
    await writeDB(db);
  },

  async markNotificationRead(id: string, userId?: string) {
    const user = uid(userId);
    const sb = supabase();
    if (sb) {
      await sb.from("notifications").update({ read: true }).eq("id", id).eq("user_id", user);
      return;
    }
    const db = await readDB();
    const n = db.notifications.find((x) => x.id === id && x.userId === user);
    if (n) n.read = true;
    await writeDB(db);
  },

  async getApplications(userId?: string): Promise<Application[]> {
    const user = uid(userId);
    const sb = supabase();
    if (sb) {
      const { data } = await sb.from("applications").select("*").eq("user_id", user);
      return (data ?? []).map((a: any) => ({ id: a.id, userId: a.user_id, type: a.type, targetId: a.target_id, status: a.status, createdAt: a.created_at }));
    }
    const db = await readDB();
    return db.applications.filter((a) => a.userId === user);
  }
};

function mapProfile(p: any): UserProfile {
  return {
    userId: p.user_id,
    name: p.name,
    email: p.email,
    country: p.country,
    goal: p.goal,
    education: p.education,
    budget: p.budget,
    interest: p.interest,
    timeline: p.timeline,
    plan: p.plan,
    onboardingCompleted: p.onboarding_completed
  };
}
function mapJob(j: any): Job { return { id: j.id, title: j.title, country: j.country, salary: j.salary, visaSponsored: j.visa_sponsored, employer: j.employer, tags: j.tags ?? [], description: j.description ?? "" }; }
function mapScholarship(s: any): Scholarship { return { id: s.id, title: s.title, country: s.country, amount: s.amount, deadline: s.deadline, tags: s.tags ?? [], description: s.description ?? "" }; }
function mapMentor(m: any): Mentor { return { id: m.id, name: m.name, field: m.field, rating: m.rating, sessions: m.sessions, country: m.country }; }
function mapPost(p: any): CommunityPost { return { id: p.id, userId: p.user_id, author: p.author, country: p.country, channel: p.channel, title: p.title, body: p.body, likes: p.likes, comments: p.comments ?? [], createdAt: p.created_at }; }
function mapBooking(b: any): Booking { return { id: b.id, userId: b.user_id, service: b.service, date: b.date, time: b.time, amount: b.amount, status: b.status, email: b.email, createdAt: b.created_at }; }
function mapEnquiry(e: any): Enquiry { return { id: e.id, name: e.name, email: e.email, subject: e.subject, message: e.message, status: e.status, createdAt: e.created_at }; }
function mapNotification(n: any): UserNotification { return { id: n.id, userId: n.user_id, type: n.type, title: n.title, body: n.body, createdAt: n.created_at, read: n.read }; }
function mapBookingToRow(b: Booking) { return { id: b.id, user_id: b.userId, service: b.service, date: b.date, time: b.time, amount: b.amount, status: b.status, email: b.email, created_at: b.createdAt }; }
function mapEnquiryToRow(e: Enquiry) { return { id: e.id, name: e.name, email: e.email, subject: e.subject, message: e.message, status: e.status, created_at: e.createdAt }; }
