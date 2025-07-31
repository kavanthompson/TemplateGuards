-- Template metadata
create table template_metadata (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id),
  filename text,
  specialty text,
  modality text,
  region text,
  protocol text,
  keywords text,
  tags text[],
  priming_phrase text,
  is_favorite boolean default false,
  inserted_at timestamp default now()
);

-- User preferences
create table profiles (
  id uuid primary key references auth.users(id),
  show_history boolean default true,
  show_favorites boolean default true
);

-- Usage tracking
create table usage_log (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid,
  template_id uuid,
  action text,
  timestamp timestamp default now()
);