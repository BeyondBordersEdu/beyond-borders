create table if not exists profiles (
  user_id text primary key,
  name text,
  email text,
  country text,
  goal text,
  education text,
  budget text,
  interest text,
  timeline text,
  plan text default 'free',
  onboarding_completed boolean default false
);

create table if not exists jobs (
  id text primary key,
  title text not null,
  country text not null,
  salary text,
  visa_sponsored boolean default false,
  employer text,
  tags text[] default '{}',
  description text
);

create table if not exists scholarships (
  id text primary key,
  title text not null,
  country text not null,
  amount text,
  deadline text,
  tags text[] default '{}',
  description text
);

create table if not exists mentors (
  id text primary key,
  name text not null,
  field text,
  rating numeric,
  sessions int default 0,
  country text
);

create table if not exists applications (
  id text primary key default gen_random_uuid()::text,
  user_id text not null,
  type text not null,
  target_id text not null,
  status text default 'saved',
  created_at timestamptz default now(),
  unique(user_id, type, target_id)
);

create table if not exists community_posts (
  id text primary key default gen_random_uuid()::text,
  user_id text not null,
  author text,
  country text,
  channel text,
  title text,
  body text,
  likes int default 0,
  comments jsonb default '[]'::jsonb,
  created_at timestamptz default now()
);

create table if not exists bookings (
  id text primary key,
  user_id text not null,
  service text not null,
  date text not null,
  time text not null,
  amount int not null,
  status text not null default 'pending',
  email text not null,
  created_at timestamptz default now()
);

create table if not exists enquiries (
  id text primary key,
  name text not null,
  email text not null,
  subject text not null,
  message text not null,
  status text default 'new',
  created_at timestamptz default now()
);

create table if not exists notifications (
  id text primary key,
  user_id text not null,
  type text not null,
  title text not null,
  body text not null,
  read boolean default false,
  created_at timestamptz default now()
);

create table if not exists mentor_sessions (
  id text primary key,
  mentor_id text not null,
  student_user_id text not null,
  booking_id text not null,
  status text not null default 'booked',
  amount int not null,
  commission_percent int not null,
  platform_commission_amount int not null,
  mentor_payout_amount int not null,
  meeting_link text,
  reminder_sent_at timestamptz,
  created_at timestamptz default now()
);

create table if not exists mentor_reviews (
  id text primary key,
  mentor_id text not null,
  user_id text not null,
  rating int not null,
  comment text not null,
  created_at timestamptz default now()
);

-- Enable RLS
alter table profiles enable row level security;
alter table applications enable row level security;
alter table community_posts enable row level security;
alter table bookings enable row level security;
alter table notifications enable row level security;
alter table mentor_sessions enable row level security;
alter table mentor_reviews enable row level security;

-- Basic policies (authenticated users scoped to their own records where relevant)
create policy if not exists "profiles_select_own" on profiles for select to authenticated using (auth.uid()::text = user_id);
create policy if not exists "profiles_update_own" on profiles for update to authenticated using (auth.uid()::text = user_id);
create policy if not exists "profiles_insert_own" on profiles for insert to authenticated with check (auth.uid()::text = user_id);

create policy if not exists "applications_own_all" on applications for all to authenticated using (auth.uid()::text = user_id) with check (auth.uid()::text = user_id);
create policy if not exists "bookings_own_all" on bookings for all to authenticated using (auth.uid()::text = user_id) with check (auth.uid()::text = user_id);
create policy if not exists "notifications_own_read" on notifications for select to authenticated using (auth.uid()::text = user_id);
create policy if not exists "community_posts_all_read" on community_posts for select to authenticated using (true);
create policy if not exists "community_posts_write_own" on community_posts for insert to authenticated with check (auth.uid()::text = user_id);
create policy if not exists "mentor_sessions_student_read" on mentor_sessions for select to authenticated using (auth.uid()::text = student_user_id);
create policy if not exists "mentor_reviews_all_read" on mentor_reviews for select to authenticated using (true);
create policy if not exists "mentor_reviews_write_own" on mentor_reviews for insert to authenticated with check (auth.uid()::text = user_id);
