-- Add onboarding fields to users table
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS primary_triggers TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT false;
