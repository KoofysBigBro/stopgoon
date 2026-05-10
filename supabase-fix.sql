-- StopGoon Database Update: Fix Missing Emails in Invites
-- Run this script in your Supabase SQL Editor

-- This allows users to see the email addresses of people they are 
-- partnered with (or have pending invites with) so it shows their names!
CREATE POLICY "Users can view partner profiles" ON public.users FOR SELECT
USING (
  id IN (
    SELECT user1_id FROM public.accountability_partners WHERE user2_id = auth.uid()
    UNION
    SELECT user2_id FROM public.accountability_partners WHERE user1_id = auth.uid()
  )
);
