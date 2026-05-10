-- StopGoon Database Update: Usernames & Notifications
-- Run this in your Supabase SQL Editor

-- 1. Add username and username change tracking to users
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS username TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS username_changed_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS last_seen_chat_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());

-- 2. Set default usernames for existing users (use part before @ in email)
UPDATE public.users SET username = split_part(email, '@', 1) WHERE username IS NULL;

-- 3. Update chat_messages to store username instead of email
ALTER TABLE public.chat_messages ADD COLUMN IF NOT EXISTS sender_username TEXT DEFAULT 'Anonymous';

-- 4. Allow users to see usernames of anyone in chat (for global chat)
CREATE POLICY "Users can view chat sender profiles" ON public.users FOR SELECT
USING (
  id IN (SELECT DISTINCT user_id FROM public.chat_messages WHERE room_id = 'global')
);
