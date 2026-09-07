-- ============================================================
-- OpenStage database schema
-- Run this once in your Supabase project: SQL Editor -> New query -> paste -> Run
-- ============================================================

-- Profiles: one row per user, extends Supabase's built-in auth.users
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  is_artist boolean default false,
  bio text,
  avatar_url text,
  created_at timestamptz default now()
);

-- Tracks: an uploaded song
create table tracks (
  id uuid primary key default gen_random_uuid(),
  artist_id uuid references profiles(id) on delete cascade not null,
  title text not null,
  audio_url text not null,
  cover_url text,
  duration_seconds integer,
  play_count integer default 0,
  rights_confirmed boolean not null default false,
  rights_confirmed_at timestamptz,
  created_at timestamptz default now()
);

-- Playlists
create table playlists (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references profiles(id) on delete cascade not null,
  name text not null,
  created_at timestamptz default now()
);

-- Join table: which tracks are in which playlist, and in what order
create table playlist_tracks (
  playlist_id uuid references playlists(id) on delete cascade,
  track_id uuid references tracks(id) on delete cascade,
  position integer not null default 0,
  added_at timestamptz default now(),
  primary key (playlist_id, track_id)
);

-- Likes: a listener liking a track
create table likes (
  user_id uuid references profiles(id) on delete cascade,
  track_id uuid references tracks(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (user_id, track_id)
);

-- Follows: a listener following an artist
create table follows (
  follower_id uuid references profiles(id) on delete cascade,
  followee_id uuid references profiles(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (follower_id, followee_id),
  check (follower_id <> followee_id)
);

-- ============================================================
-- Row Level Security: locks down who can read/write what.
-- Without this, ANY visitor could read or edit ANY row.
-- ============================================================

alter table profiles enable row level security;
alter table tracks enable row level security;
alter table playlists enable row level security;
alter table playlist_tracks enable row level security;
alter table likes enable row level security;
alter table follows enable row level security;

-- Profiles: anyone can view profiles; you can only edit your own
create policy "Profiles are publicly readable" on profiles for select using (true);
create policy "Users can insert their own profile" on profiles for insert with check (auth.uid() = id);
create policy "Users can update their own profile" on profiles for update using (auth.uid() = id);

-- Tracks: anyone can view; only the artist can upload/edit/delete their own
create policy "Tracks are publicly readable" on tracks for select using (true);
create policy "Artists can upload their own tracks" on tracks for insert with check (auth.uid() = artist_id);
create policy "Artists can update their own tracks" on tracks for update using (auth.uid() = artist_id);
create policy "Artists can delete their own tracks" on tracks for delete using (auth.uid() = artist_id);

-- Playlists: anyone can view; only the owner can create/edit/delete their own
create policy "Playlists are publicly readable" on playlists for select using (true);
create policy "Users can create their own playlists" on playlists for insert with check (auth.uid() = owner_id);
create policy "Users can update their own playlists" on playlists for update using (auth.uid() = owner_id);
create policy "Users can delete their own playlists" on playlists for delete using (auth.uid() = owner_id);

-- Playlist tracks: readable by anyone; only the playlist owner can add/remove tracks
create policy "Playlist contents are publicly readable" on playlist_tracks for select using (true);
create policy "Owners can add tracks to their playlists" on playlist_tracks for insert with check (
  exists (select 1 from playlists where playlists.id = playlist_id and playlists.owner_id = auth.uid())
);
create policy "Owners can remove tracks from their playlists" on playlist_tracks for delete using (
  exists (select 1 from playlists where playlists.id = playlist_id and playlists.owner_id = auth.uid())
);

-- Likes: readable by anyone; users can only like/unlike as themselves
create policy "Likes are publicly readable" on likes for select using (true);
create policy "Users can like tracks" on likes for insert with check (auth.uid() = user_id);
create policy "Users can unlike tracks" on likes for delete using (auth.uid() = user_id);

-- Follows: readable by anyone; users can only follow/unfollow as themselves
create policy "Follows are publicly readable" on follows for select using (true);
create policy "Users can follow" on follows for insert with check (auth.uid() = follower_id);
create policy "Users can unfollow" on follows for delete using (auth.uid() = follower_id);

-- ============================================================
-- Storage: run these in the same SQL editor AFTER creating two
-- buckets named "tracks" and "covers" in Storage -> New bucket
-- (see README for the click-by-click steps). Mark both Public.
-- ============================================================

create policy "Anyone can read track audio"
  on storage.objects for select using (bucket_id = 'tracks');
create policy "Authenticated users can upload track audio"
  on storage.objects for insert with check (bucket_id = 'tracks' and auth.role() = 'authenticated');

create policy "Anyone can read cover art"
  on storage.objects for select using (bucket_id = 'covers');
create policy "Authenticated users can upload cover art"
  on storage.objects for insert with check (bucket_id = 'covers' and auth.role() = 'authenticated');
