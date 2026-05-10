import React from 'react';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import ChatClient from './ChatClient';

export const metadata = {
  title: 'Community Chat | StopGoon',
};

export default async function ChatPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch premium status
  const { data: profile } = await supabase
    .from('users')
    .select('subscription_tier')
    .eq('id', user.id)
    .single();

  const isPremium = profile?.subscription_tier === 'premium';

  // Fetch accepted partners for DM tabs
  const { data: partnerships } = await supabase
    .from('accountability_partners')
    .select(`
      *,
      user1:users!user1_id(id, email),
      user2:users!user2_id(id, email)
    `)
    .eq('status', 'accepted')
    .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`);

  // Build list of partners for DM tabs
  const partners = (partnerships || []).map(p => {
    const isUser1 = p.user1_id === user.id;
    const partner = isUser1 ? p.user2 : p.user1;
    // Room ID is a sorted combo of both user IDs
    const roomId = [p.user1_id, p.user2_id].sort().join('_');
    return {
      id: partner?.id,
      email: partner?.email || 'Partner',
      roomId,
    };
  });

  return (
    <ChatClient
      userId={user.id}
      userEmail={user.email || 'Anonymous'}
      isPremium={isPremium}
      partners={partners}
    />
  );
}
