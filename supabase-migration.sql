-- Migration: Add new tables and columns for the full rebuild
-- Run this in your Supabase SQL Editor

-- 1. Expand journal_entries with new columns
ALTER TABLE public.journal_entries ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE public.journal_entries ADD COLUMN IF NOT EXISTS mood TEXT;
ALTER TABLE public.journal_entries ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';
ALTER TABLE public.journal_entries ADD COLUMN IF NOT EXISTS is_draft BOOLEAN DEFAULT FALSE;

-- 2. Add delete policy for journal entries
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can delete own journal') THEN
    CREATE POLICY "Users can delete own journal" ON public.journal_entries FOR DELETE USING (auth.uid() = user_id);
  END IF;
END $$;

-- 3. Create urge_logs table (separate from relapses for granular tracking)
CREATE TABLE IF NOT EXISTS public.urge_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  intensity INTEGER CHECK (intensity >= 1 AND intensity <= 10) DEFAULT 5,
  trigger TEXT,
  emotion TEXT,
  notes TEXT,
  coping_used TEXT,
  urge_passed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.urge_logs ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view own urge_logs') THEN
    CREATE POLICY "Users can view own urge_logs" ON public.urge_logs FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can insert own urge_logs') THEN
    CREATE POLICY "Users can insert own urge_logs" ON public.urge_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can update own urge_logs') THEN
    CREATE POLICY "Users can update own urge_logs" ON public.urge_logs FOR UPDATE USING (auth.uid() = user_id);
  END IF;
END $$;

-- 4. Create daily_checkins table
CREATE TABLE IF NOT EXISTS public.daily_checkins (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  mood TEXT NOT NULL, -- 'great', 'okay', 'struggling'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.daily_checkins ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view own checkins') THEN
    CREATE POLICY "Users can view own checkins" ON public.daily_checkins FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can insert own checkins') THEN
    CREATE POLICY "Users can insert own checkins" ON public.daily_checkins FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- 5. Expand settings table
ALTER TABLE public.settings ADD COLUMN IF NOT EXISTS high_contrast BOOLEAN DEFAULT FALSE;
ALTER TABLE public.settings ADD COLUMN IF NOT EXISTS simplified_mode BOOLEAN DEFAULT FALSE;
ALTER TABLE public.settings ADD COLUMN IF NOT EXISTS daily_reminder BOOLEAN DEFAULT FALSE;
ALTER TABLE public.settings ADD COLUMN IF NOT EXISTS default_triggers TEXT[] DEFAULT '{}';
