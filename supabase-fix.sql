-- StopGoon Database Update: Fix Connection Code Lookup
-- Run this script in your Supabase SQL Editor

-- We need a SECURITY DEFINER function so users can look up 
-- their partner's ID without violating Row Level Security.
CREATE OR REPLACE FUNCTION get_user_id_by_code(p_code TEXT)
RETURNS UUID AS $$
DECLARE
  v_user_id UUID;
BEGIN
  SELECT id INTO v_user_id FROM public.users WHERE connection_code = p_code LIMIT 1;
  RETURN v_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
