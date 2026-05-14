-- StopGoon Database Update: Soft Delete Chat Messages
-- Run this in your Supabase SQL Editor

-- 1. Add is_deleted column
ALTER TABLE public.chat_messages ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT false NOT NULL;

-- 2. Create a secure RPC for users to soft delete their own messages
CREATE OR REPLACE FUNCTION user_delete_own_message(msg_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.chat_messages
  SET is_deleted = true
  WHERE id = msg_id AND user_id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
