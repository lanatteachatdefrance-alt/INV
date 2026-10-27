-- Separate native FCM registration tokens from Web Push subscriptions.
create table if not exists public.fcm_tokens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  token text not null unique,
  platform text not null default 'android' check (platform = 'android'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists fcm_tokens_user_id_idx
  on public.fcm_tokens (user_id);

alter table public.fcm_tokens enable row level security;

revoke all on table public.fcm_tokens from anon, authenticated;
grant select, insert, update, delete on table public.fcm_tokens to authenticated;

 drop policy if exists "Users can view their own FCM tokens" on public.fcm_tokens;
create policy "Users can view their own FCM tokens"
  on public.fcm_tokens for select
  using (auth.uid() = user_id);

drop policy if exists "Users can add their own FCM tokens" on public.fcm_tokens;
create policy "Users can add their own FCM tokens"
  on public.fcm_tokens for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update their own FCM tokens" on public.fcm_tokens;
create policy "Users can update their own FCM tokens"
  on public.fcm_tokens for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own FCM tokens" on public.fcm_tokens;
create policy "Users can delete their own FCM tokens"
  on public.fcm_tokens for delete
  using (auth.uid() = user_id);
