-- StopGoon: Owner role, message deletion, chat avatars
-- Run this in your Supabase SQL Editor

-- 1. Update role check to include 'owner'
ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_role_check;
ALTER TABLE public.users ADD CONSTRAINT users_role_check CHECK (role IN ('user', 'admin', 'owner'));

-- 2. Add avatar + role to chat messages for display
ALTER TABLE public.chat_messages ADD COLUMN IF NOT EXISTS sender_avatar_url TEXT;
ALTER TABLE public.chat_messages ADD COLUMN IF NOT EXISTS sender_role TEXT DEFAULT 'user';

-- 3. Allow admins/owners to delete chat messages
CREATE POLICY "Admins can delete chat messages" ON public.chat_messages FOR DELETE
USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'owner'))
);

-- 4. Admin RPC: delete a specific message
CREATE OR REPLACE FUNCTION admin_delete_message(message_id UUID)
RETURNS VOID AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'owner')) THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;
  DELETE FROM public.chat_messages WHERE id = message_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Update all admin RPC functions to also allow 'owner' role
CREATE OR REPLACE FUNCTION admin_mute_user(target_user_id UUID, mute_duration_hours INT DEFAULT 24)
RETURNS VOID AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'owner')) THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;
  UPDATE public.users SET is_muted = true, muted_until = now() + (mute_duration_hours || ' hours')::interval WHERE id = target_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION admin_unmute_user(target_user_id UUID)
RETURNS VOID AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'owner')) THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;
  UPDATE public.users SET is_muted = false, muted_until = NULL WHERE id = target_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION admin_ban_user(target_user_id UUID, reason TEXT DEFAULT 'Violation of community guidelines')
RETURNS VOID AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'owner')) THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;
  UPDATE public.users SET is_banned = true, ban_reason = reason WHERE id = target_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION admin_unban_user(target_user_id UUID)
RETURNS VOID AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'owner')) THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;
  UPDATE public.users SET is_banned = false, ban_reason = NULL WHERE id = target_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. RPC to get a user's public profile (for clicking avatars)
CREATE OR REPLACE FUNCTION get_public_profile(target_user_id UUID)
RETURNS TABLE(username TEXT, avatar_url TEXT, is_public BOOLEAN, role TEXT, created_at TIMESTAMPTZ) AS $$
BEGIN
  RETURN QUERY SELECT u.username, u.avatar_url, u.is_public, u.role, u.created_at
  FROM public.users u WHERE u.id = target_user_id LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. RPC to get a user's public stats (streak, journal count, etc.)
CREATE OR REPLACE FUNCTION get_public_stats(target_user_id UUID)
RETURNS TABLE(journal_count BIGINT, checkin_count BIGINT, days_since_relapse BIGINT) AS $$
DECLARE
  v_is_public BOOLEAN;
BEGIN
  SELECT u.is_public INTO v_is_public FROM public.users u WHERE u.id = target_user_id;
  IF v_is_public IS NOT TRUE THEN
    RETURN;
  END IF;
  RETURN QUERY SELECT
    (SELECT count(*) FROM public.journal_entries WHERE user_id = target_user_id),
    (SELECT count(*) FROM public.daily_checkins WHERE user_id = target_user_id),
    COALESCE(
      EXTRACT(DAY FROM now() - (SELECT max(r.created_at) FROM public.relapses r WHERE r.user_id = target_user_id))::BIGINT,
      EXTRACT(DAY FROM now() - (SELECT u.created_at FROM public.users u WHERE u.id = target_user_id))::BIGINT
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
