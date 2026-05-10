-- StopGoon: Add reasons_to_quit to users table
-- Run this in your Supabase SQL Editor

ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS reasons_to_quit TEXT[] DEFAULT '{}';
