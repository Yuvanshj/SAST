-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Create Bidders Table (Historical / Training Data)
create table if not exists public.bidders (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text,
  bidder_id text,
  budget numeric,
  priority text,
  organization_type text,
  budget_million_usd numeric,
  priority_level text,
  urgency_score int,
  technical_readiness int default 5,
  payload_mass_kg numeric,
  launch_window_date date,
  mission_type text,
  reliability_score numeric,
  constraint has_identifier check (name is not null or bidder_id is not null)
);

-- 2. Create Active Bids Table (Live Session Data)
create table if not exists public.active_bids (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text,
  bidder_id text,
  budget numeric,
  priority text,
  
  -- Extra fields for consistency
  organization_type text,
  priority_score numeric, -- Cached score
  
  constraint has_identifier_live check (name is not null)
);

-- 3. Create Auction Settings Table
create table if not exists public.auction_settings (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  budget_weight numeric default 0.6,
  priority_weight numeric default 0.4,
  is_active boolean default true
);

-- 4. Create Auction Results Table
create table if not exists public.auction_results (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  winner_id text,
  winner_score numeric,
  calculation_snapshot jsonb
);

-- 5. Insert Default Settings (Idempotent)
insert into public.auction_settings (budget_weight, priority_weight)
select 0.6, 0.4
where not exists (select 1 from public.auction_settings);

-- 6. Enable Realtime
alter publication supabase_realtime add table public.bidders;
alter publication supabase_realtime add table public.active_bids;
alter publication supabase_realtime add table public.auction_settings;

-- 7. Row Level Security (Permissive for Demo)
alter table public.bidders enable row level security;
alter table public.active_bids enable row level security;
alter table public.auction_settings enable row level security;
alter table public.auction_results enable row level security;

create policy "Enable read access for all users" on public.bidders for select using (true);
create policy "Enable insert access for all users" on public.bidders for insert with check (true);
create policy "Enable update access for all users" on public.bidders for update using (true);
create policy "Enable delete access for all users" on public.bidders for delete using (true);

create policy "Enable read access for all users" on public.active_bids for select using (true);
create policy "Enable insert access for all users" on public.active_bids for insert with check (true);
create policy "Enable update access for all users" on public.active_bids for update using (true);
create policy "Enable delete access for all users" on public.active_bids for delete using (true);

create policy "Enable read access for all users" on public.auction_settings for select using (true);
create policy "Enable update access for all users" on public.auction_settings for update using (true);

create policy "Enable read access for all users" on public.auction_results for select using (true);
create policy "Enable insert access for all users" on public.auction_results for insert with check (true);
