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
  let { data: profile } = await supabase
    .from('users')
    .select('subscription_tier, connection_code')
    .eq('id', user.id)
    .single();

  // Auto-heal: Generate a connection code if they don't have one
  if (profile && !profile.connection_code) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let newCode = '';
    for (let i = 0; i < 6; i++) {
      newCode += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    await supabase.from('users').update({ connection_code: newCode }).eq('id', user.id);
    profile.connection_code = newCode;
  }

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
