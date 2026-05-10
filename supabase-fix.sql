-- StopGoon Database Update: Chat System Setup
-- Run this in your Supabase SQL Editor

-- 1. Fix partner emails being hidden (RLS policy)
CREATE POLICY "Users can view partner profiles" ON public.users FOR SELECT
USING (
  id IN (
    SELECT user1_id FROM public.accountability_partners WHERE user2_id = auth.uid()
    UNION
    SELECT user2_id FROM public.accountability_partners WHERE user1_id = auth.uid()
  )
);

-- 2. Add columns for chat rooms and sender names
ALTER TABLE public.chat_messages ADD COLUMN IF NOT EXISTS room_id TEXT DEFAULT 'global' NOT NULL;
ALTER TABLE public.chat_messages ADD COLUMN IF NOT EXISTS sender_email TEXT DEFAULT 'Anonymous' NOT NULL;

-- 3. Enable Supabase Realtime on chat_messages so messages appear instantly
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;

-- 4. Add policy so users can only read DMs they are part of
DROP POLICY IF EXISTS "Anyone can view chat messages" ON public.chat_messages;
CREATE POLICY "Users can view allowed chat messages" ON public.chat_messages FOR SELECT
USING (
  room_id = 'global'
  OR user_id = auth.uid()
  OR room_id IN (
    SELECT
      CASE
        WHEN user1_id < user2_id THEN user1_id || '_' || user2_id
        ELSE user2_id || '_' || user1_id
      END
    FROM public.accountability_partners
    WHERE (user1_id = auth.uid() OR user2_id = auth.uid())
      AND status = 'accepted'
  )
);
