-- supabase/schema.sql

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (Extends Supabase Auth users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  subscription_tier TEXT DEFAULT 'free',
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  connection_code TEXT UNIQUE,
  lemon_squeezy_customer_id TEXT,
  lemon_squeezy_subscription_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Function to generate random connection codes
CREATE OR REPLACE FUNCTION generate_connection_code()
RETURNS TEXT AS $$
DECLARE
    chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    result TEXT := '';
    i INTEGER := 0;
BEGIN
    FOR i IN 1..6 LOOP
        result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
    END LOOP;
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Settings Table
CREATE TABLE IF NOT EXISTS public.settings (
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE PRIMARY KEY,
  theme TEXT DEFAULT 'midnight',
  font_scale TEXT DEFAULT 'normal',
  motion TEXT DEFAULT 'normal',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Relapses / Milestones Table
CREATE TABLE IF NOT EXISTS public.relapses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  reason TEXT,
  intensity INTEGER CHECK (intensity >= 1 AND intensity <= 10),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Journal Entries Table
CREATE TABLE IF NOT EXISTS public.journal_entries (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL, -- 'reflection', 'gratitude', 'urge'
  content TEXT NOT NULL,
  intensity INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.relapses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accountability_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Create Policies
CREATE POLICY "Users can view own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own settings" ON public.settings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own settings" ON public.settings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own settings" ON public.settings FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own relapses" ON public.relapses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own relapses" ON public.relapses FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own journal" ON public.journal_entries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own journal" ON public.journal_entries FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own partnerships" ON public.accountability_partners FOR SELECT USING (auth.uid() = user1_id OR auth.uid() = user2_id);
CREATE POLICY "Users can insert partnerships" ON public.accountability_partners FOR INSERT WITH CHECK (auth.uid() = user1_id OR auth.uid() = user2_id);
CREATE POLICY "Users can update their partnerships" ON public.accountability_partners FOR UPDATE USING (auth.uid() = user1_id OR auth.uid() = user2_id);

CREATE POLICY "Anyone can view chat messages" ON public.chat_messages FOR SELECT USING (true);
CREATE POLICY "Logged in users can insert messages" ON public.chat_messages FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Trigger to automatically create a public.users row when a new auth.users is created
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, connection_code)
  VALUES (new.id, new.email, generate_connection_code());
  
  INSERT INTO public.settings (user_id)
  VALUES (new.id);
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Webhook event log for idempotent processing
CREATE TABLE IF NOT EXISTS public.lemonsqueezy_webhook_events (
  event_key TEXT PRIMARY KEY,
  event_name TEXT NOT NULL,
  resource_id TEXT,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  payload JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.lemonsqueezy_webhook_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "No direct reads on webhook events"
  ON public.lemonsqueezy_webhook_events
  FOR SELECT
  USING (false);

CREATE POLICY "No direct writes on webhook events"
  ON public.lemonsqueezy_webhook_events
  FOR ALL
  USING (false)
  WITH CHECK (false);

-- Upgrade funnel analytics events
CREATE TABLE IF NOT EXISTS public.upgrade_funnel_events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  event_name TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.upgrade_funnel_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own upgrade funnel events"
  ON public.upgrade_funnel_events
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own upgrade funnel events"
  ON public.upgrade_funnel_events
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);
