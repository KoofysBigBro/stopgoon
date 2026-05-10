-- StopGoon Database Update: Realtime Chat Support
-- Run this in Supabase SQL Editor

-- 1. Add room_id to support both Global and Private chats
ALTER TABLE public.chat_messages ADD COLUMN IF NOT EXISTS room_id TEXT DEFAULT 'global' NOT NULL;
ALTER TABLE public.chat_messages ADD COLUMN IF NOT EXISTS sender_email TEXT NOT NULL DEFAULT 'Anonymous';

-- 2. Turn on Supabase Realtime for the chat table so it auto-updates!
BEGIN;
  -- Remove the table from the publication if it's already there to avoid errors
  ALTER PUBLICATION supabase_realtime DROP TABLE public.chat_messages;
EXCEPTION
  WHEN undefined_object THEN NULL;
END;
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;
