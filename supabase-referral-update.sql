-- StopGoon Database Update: Capture Referral Source during Registration
-- Run this script in your Supabase SQL Editor (https://supabase.com dashboard)

-- 1. Add referral_source column to public.users table if it doesn't exist
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS referral_source TEXT;

-- 2. Update the public.handle_new_user trigger function to capture referral_source from raw_user_meta_data
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, connection_code, referral_source)
  VALUES (
    new.id,
    new.email,
    generate_connection_code(),
    COALESCE(new.raw_user_meta_data->>'referral_source', 'other')
  );
  
  INSERT INTO public.settings (user_id)
  VALUES (new.id);
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
