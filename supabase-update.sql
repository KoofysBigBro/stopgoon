-- StopGoon Database Update: Accountability Partners & Live Chat
-- Run this script in your Supabase SQL Editor

-- 1. Create Accountability Partners Table
CREATE TABLE public.accountability_partners (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user1_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    user2_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user1_id, user2_id)
);

-- RLS Policies for Accountability Partners
ALTER TABLE public.accountability_partners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own partnerships"
    ON public.accountability_partners
    FOR SELECT
    USING (auth.uid() = user1_id OR auth.uid() = user2_id);

CREATE POLICY "Users can insert partnerships"
    ON public.accountability_partners
    FOR INSERT
    WITH CHECK (auth.uid() = user1_id OR auth.uid() = user2_id);

CREATE POLICY "Users can update their partnerships"
    ON public.accountability_partners
    FOR UPDATE
    USING (auth.uid() = user1_id OR auth.uid() = user2_id);

-- 2. Create Live Chat Messages Table
CREATE TABLE public.chat_messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS Policies for Chat
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view chat messages"
    ON public.chat_messages
    FOR SELECT
    USING (true);

CREATE POLICY "Logged in users can insert messages"
    ON public.chat_messages
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- 3. Update the existing users table to include a connection code
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS connection_code TEXT UNIQUE;

-- Function to generate random connection codes for new users
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

-- Generate connection codes for existing users
UPDATE public.users SET connection_code = generate_connection_code() WHERE connection_code IS NULL;
