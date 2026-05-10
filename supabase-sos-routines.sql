-- StopGoon: Custom SOS Routines
-- Run this in your Supabase SQL Editor

-- 1. Table for custom SOS routines
CREATE TABLE IF NOT EXISTS public.sos_routines (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  steps JSONB NOT NULL DEFAULT '[]',
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable RLS
ALTER TABLE public.sos_routines ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own routines" ON public.sos_routines
  FOR ALL USING (auth.uid() = user_id);
