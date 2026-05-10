-- StopGoon: Unique Usernames Fix
-- Run this in your Supabase SQL Editor

-- 1. Make usernames unique (no duplicates allowed)
ALTER TABLE public.users ADD CONSTRAINT users_username_unique UNIQUE (username);
