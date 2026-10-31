-- =====================================================================================
-- REPURPOSEONE SOCIAL MEDIA INTEGRATION SYSTEM — SUPABASE SCHEMA MIGRATION
-- =====================================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. CONNECTED ACCOUNTS TABLE
create table if not exists public.connected_accounts (
    id uuid default uuid_generate_v4() primary key,
    user_id text not null,
    platform text not null check (platform in ('instagram', 'linkedin', 'youtube', 'x')),
    platform_user_id text not null,
    username text not null,
    display_name text,
    profile_image_url text,
    encrypted_access_token text not null,
    encrypted_refresh_token text,
    token_expires_at timestamptz,
    granted_scopes text[] default '{}',
    connection_status text default 'connected' check (connection_status in ('connected', 'expired', 'error', 'disconnected')),
    connected_at timestamptz default now(),
    updated_at timestamptz default now(),
    constraint unique_user_platform_account unique (user_id, platform, platform_user_id)
);

create index if not exists idx_connected_accounts_user on public.connected_accounts(user_id);
create index if not exists idx_connected_accounts_platform on public.connected_accounts(platform);

-- 2. PUBLISHING JOBS TABLE
create table if not exists public.publishing_jobs (
    id uuid default uuid_generate_v4() primary key,
    user_id text not null,
    connected_account_id uuid references public.connected_accounts(id) on delete cascade,
    platform text not null,
    content_type text not null check (content_type in ('text', 'image', 'video', 'carousel', 'thread')),
    content_payload jsonb not null default '{}'::jsonb,
    media_urls text[] default '{}',
    scheduled_at timestamptz,
    publishing_status text default 'pending' check (publishing_status in ('pending', 'processing', 'published', 'failed', 'cancelled')),
    external_post_id text,
    external_post_url text,
    error_message text,
    published_at timestamptz,
    created_at timestamptz default now()
);

create index if not exists idx_publishing_jobs_user on public.publishing_jobs(user_id);
create index if not exists idx_publishing_jobs_status on public.publishing_jobs(publishing_status);
create index if not exists idx_publishing_jobs_scheduled on public.publishing_jobs(scheduled_at);

-- 3. INTEGRATION SETTINGS TABLE (Meta & provider metadata only, no raw secrets)
create table if not exists public.integration_settings (
    id uuid default uuid_generate_v4() primary key,
    platform text not null unique check (platform in ('instagram', 'linkedin', 'youtube', 'x')),
    is_enabled boolean default false,
    app_id_preview text,
    configured_redirect_uri text,
    required_scopes text[] default '{}',
    api_tier text default 'free_or_standard',
    last_verified_at timestamptz,
    updated_at timestamptz default now()
);

-- Row Level Security (RLS)
alter table public.connected_accounts enable row level security;
alter table public.publishing_jobs enable row level security;
alter table public.integration_settings enable row level security;

-- Policies for connected_accounts
create policy "Users can view and manage their own connected accounts"
    on public.connected_accounts
    for all
    using (auth.uid()::text = user_id or user_id = current_setting('request.jwt.claim.sub', true));

-- Policies for publishing_jobs
create policy "Users can view and manage their own publishing jobs"
    on public.publishing_jobs
    for all
    using (auth.uid()::text = user_id or user_id = current_setting('request.jwt.claim.sub', true));

-- Policies for integration_settings (Public read status, Admin write)
create policy "Anyone can view integration status"
    on public.integration_settings
    for select
    using (true);
