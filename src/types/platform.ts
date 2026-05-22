export type UserProfile = {
  userId: string;
  name: string;
  email: string;
  country: string;
  goal: string;
  education: string;
  budget: string;
  interest: string;
  timeline: string;
  plan: "free" | "pro" | "premium";
  onboardingCompleted: boolean;
};

export type Job = {
  id: string;
  title: string;
  country: string;
  salary: string;
  visaSponsored: boolean;
  employer: string;
  tags: string[];
  description: string;
};

export type Scholarship = {
  id: string;
  title: string;
  country: string;
  amount: string;
  deadline: string;
  tags: string[];
  description: string;
};

export type Mentor = {
  id: string;
  name: string;
  field: string;
  rating: number;
  sessions: number;
  country: string;
};

export type CommunityPost = {
  id: string;
  userId: string;
  author: string;
  country: string;
  channel: string;
  title: string;
  body: string;
  likes: number;
  comments: { id: string; author: string; body: string }[];
  createdAt: string;
};

export type Application = {
  id: string;
  userId: string;
  type: "job" | "scholarship";
  targetId: string;
  status: "saved" | "applied";
  createdAt: string;
};

export type PlatformDB = {
  profiles: UserProfile[];
  jobs: Job[];
  scholarships: Scholarship[];
  mentors: Mentor[];
  posts: CommunityPost[];
  applications: Application[];
  bookings: Booking[];
  enquiries: Enquiry[];
  notifications: UserNotification[];
  mentorSessions: MentorSession[];
  mentorReviews: MentorReview[];
  communityReports: CommunityReport[];
  podcastEpisodes: PodcastEpisode[];
  chatRooms: ChatRoom[];
  chatMessages: ChatMessage[];
};

export type Booking = {
  id: string;
  userId: string;
  service: "career_call" | "visa_call" | "cv_review";
  date: string;
  time: string;
  amount: number;
  status: "pending" | "paid" | "confirmed";
  email: string;
  createdAt: string;
};

export type Enquiry = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  status: "new" | "read";
};

export type UserNotification = {
  id: string;
  userId: string;
  type: "job" | "scholarship" | "visa" | "system";
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
};

export type MentorSession = {
  id: string;
  mentorId: string;
  studentUserId: string;
  bookingId: string;
  status: "booked" | "completed" | "cancelled";
  amount: number;
  commissionPercent: number;
  platformCommissionAmount: number;
  mentorPayoutAmount: number;
  meetingLink?: string;
  reminderSentAt?: string | null;
  createdAt: string;
};

export type MentorReview = {
  id: string;
  mentorId: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: string;
};

export type CommunityReport = {
  id: string;
  postId: string;
  reporterUserId: string;
  reason: string;
  status: "open" | "resolved";
  createdAt: string;
};

export type PodcastEpisode = {
  id: string;
  title: string;
  category: "study_abroad" | "visa_experience" | "job_tips";
  mediaType: "audio" | "video";
  mediaUrl: string;
  author: string;
  likes: number;
  comments: { id: string; author: string; body: string }[];
  createdAt: string;
};

export type ChatRoom = {
  id: string;
  slug: string;
  title: string;
  description: string;
};

export type ChatMessage = {
  id: string;
  roomId: string;
  userId: string;
  author: string;
  body: string;
  flagged: boolean;
  createdAt: string;
};
