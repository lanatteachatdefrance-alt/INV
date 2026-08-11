-- =============================================================
-- SCHEMA SUPABASE COMPATIBLE POSTGRESQL
-- Exécutable sur un nouveau projet Supabase
-- =============================================================

create extension if not exists pgcrypto;

-- 1. Profil utilisateur lié à l'auth Supabase
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now()),
  email text,
  first_name text,
  last_name text,
  phone text,
  date_of_birth date,
  address text,
  nationality text,
  id_number text,
  id_document_url text,
  residence_proof_url text,
  role text not null default 'client',
  kyc_status text not null default 'en_attente',
  balance numeric not null default 0.00
);

alter table public.users enable row level security;

create index if not exists users_role_idx on public.users(role);
create index if not exists users_kyc_status_idx on public.users(kyc_status);
create index if not exists users_created_at_idx on public.users(created_at desc);

-- 2. Offres d'investissement
create table if not exists public.investment_offers (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now()),
  title text not null,
  description text,
  type text not null,
  roi_percentage numeric not null default 0,
  price_per_share numeric,
  minimum_investment numeric not null default 0,
  is_active boolean not null default true,
  end_date timestamptz
);

alter table public.investment_offers disable row level security;

create index if not exists investment_offers_active_idx on public.investment_offers(is_active, end_date);
create index if not exists investment_offers_type_idx on public.investment_offers(type);

-- 3. Investissements actifs des utilisateurs
create table if not exists public.user_investments (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now()),
  user_id uuid not null references public.users(id) on delete cascade,
  offer_id uuid references public.investment_offers(id) on delete set null,
  amount_invested numeric not null,
  shares_bought numeric,
  status text not null default 'actif',
  current_value numeric
);

alter table public.user_investments disable row level security;

create index if not exists user_investments_user_idx on public.user_investments(user_id);
create index if not exists user_investments_offer_idx on public.user_investments(offer_id);
create index if not exists user_investments_status_idx on public.user_investments(status);

-- 4. Historique des transactions
create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now()),
  user_id uuid not null references public.users(id) on delete cascade,
  type text not null,
  amount numeric not null,
  status text not null default 'complété',
  description text
);

alter table public.transactions disable row level security;

create index if not exists transactions_user_idx on public.transactions(user_id);
create index if not exists transactions_type_idx on public.transactions(type);
create index if not exists transactions_created_at_idx on public.transactions(created_at desc);

-- 5. Requêtes de contact
create table if not exists public.contact_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now()),
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text,
  subject text,
  message text not null,
  status text not null default 'nouveau',
  notes text
);

alter table public.contact_requests disable row level security;

create index if not exists contact_requests_status_idx on public.contact_requests(status);

-- 6. Fonctions utiles
create or replace function public.is_admin()
returns boolean as $$
begin
  return exists (
    select 1 from public.users where id = auth.uid() and role = 'admin'
  );
end;
$$ language plpgsql security definer;

create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql security definer;

-- 7. Triggers de mise à jour des dates
Drop trigger if exists users_set_updated_at on public.users;
create trigger users_set_updated_at
  before update on public.users
  for each row execute procedure public.update_updated_at();

drop trigger if exists investment_offers_set_updated_at on public.investment_offers;
create trigger investment_offers_set_updated_at
  before update on public.investment_offers
  for each row execute procedure public.update_updated_at();

drop trigger if exists user_investments_set_updated_at on public.user_investments;
create trigger user_investments_set_updated_at
  before update on public.user_investments
  for each row execute procedure public.update_updated_at();

drop trigger if exists transactions_set_updated_at on public.transactions;
create trigger transactions_set_updated_at
  before update on public.transactions
  for each row execute procedure public.update_updated_at();

drop trigger if exists contact_requests_set_updated_at on public.contact_requests;
create trigger contact_requests_set_updated_at
  before update on public.contact_requests
  for each row execute procedure public.update_updated_at();

-- 8. Trigger d'auto-création du profil utilisateur
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (
    id,
    email,
    first_name,
    last_name,
    phone,
    date_of_birth,
    address,
    nationality
  )
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name',
    new.raw_user_meta_data->>'phone',
    (new.raw_user_meta_data->>'date_of_birth')::date,
    new.raw_user_meta_data->>'address',
    new.raw_user_meta_data->>'nationality'
  )
  on conflict (id) do nothing;

  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 9. Politiques RLS compatibles Supabase
-- users
Drop policy if exists "users_view_own_profile" on public.users;
create policy "users_view_own_profile"
  on public.users for select using (auth.uid() = id);

drop policy if exists "admins_view_all_profiles" on public.users;
create policy "admins_view_all_profiles"
  on public.users for select using (public.is_admin());

drop policy if exists "users_update_own_profile" on public.users;
create policy "users_update_own_profile"
  on public.users for update using (auth.uid() = id);

drop policy if exists "admins_update_all_profiles" on public.users;
create policy "admins_update_all_profiles"
  on public.users for update using (public.is_admin());

drop policy if exists "users_insert_own_profile" on public.users;
create policy "users_insert_own_profile"
  on public.users for insert with check (auth.uid() = id);

-- investment_offers
Drop policy if exists "anyone_read_active_offers" on public.investment_offers;
create policy "anyone_read_active_offers"
  on public.investment_offers for select using (is_active = true);

drop policy if exists "admins_manage_offers" on public.investment_offers;
create policy "admins_manage_offers"
  on public.investment_offers for all using (public.is_admin()) with check (public.is_admin());

-- user_investments
Drop policy if exists "users_view_own_investments" on public.user_investments;
create policy "users_view_own_investments"
  on public.user_investments for select using (auth.uid() = user_id);

drop policy if exists "users_insert_own_investments" on public.user_investments;
create policy "users_insert_own_investments"
  on public.user_investments for insert with check (auth.uid() = user_id);

drop policy if exists "users_update_own_investments" on public.user_investments;
create policy "users_update_own_investments"
  on public.user_investments for update using (auth.uid() = user_id);

drop policy if exists "admins_manage_all_investments" on public.user_investments;
create policy "admins_manage_all_investments"
  on public.user_investments for all using (public.is_admin()) with check (public.is_admin());

-- transactions
Drop policy if exists "users_view_own_transactions" on public.transactions;
create policy "users_view_own_transactions"
  on public.transactions for select using (auth.uid() = user_id);

drop policy if exists "users_insert_own_transactions" on public.transactions;
create policy "users_insert_own_transactions"
  on public.transactions for insert with check (auth.uid() = user_id);

drop policy if exists "admins_manage_all_transactions" on public.transactions;
create policy "admins_manage_all_transactions"
  on public.transactions for all using (public.is_admin()) with check (public.is_admin());

-- contact_requests
Drop policy if exists "anyone_create_contact_requests" on public.contact_requests;
create policy "anyone_create_contact_requests"
  on public.contact_requests for insert with check (true);

drop policy if exists "admins_manage_contact_requests" on public.contact_requests;
create policy "admins_manage_contact_requests"
  on public.contact_requests for all using (public.is_admin()) with check (public.is_admin());

-- 10. Exemple de promotion d'admin
-- update public.users set role = 'admin' where id in (
--   select id from auth.users where email = 'admin@invest.com'
-- );
