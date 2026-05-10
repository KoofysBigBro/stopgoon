import React from 'react';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import AccountabilityClient from './AccountabilityClient';

export const metadata = {
  title: 'Accountability | StopGoon',
};

export default async function AccountabilityPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch the current user's premium status and connection code
  const { data: profile } = await supabase
    .from('users')
    .select('subscription_tier, connection_code')
    .eq('id', user.id)
    .single();

  const isPremium = profile?.subscription_tier === 'premium';
  const connectionCode = profile?.connection_code || '';

  // Fetch all partnerships involving this user (both incoming and outgoing)
  const { data: partnerships } = await supabase
    .from('accountability_partners')
    .select(`
      *,
      user1:users!user1_id(email),
      user2:users!user2_id(email)
    `)
    .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
    .order('created_at', { ascending: false });

  return (
    <AccountabilityClient 
      userId={user.id} 
      connectionCode={connectionCode} 
      partnerships={partnerships || []} 
      isPremium={isPremium} 
    />
  );
}
