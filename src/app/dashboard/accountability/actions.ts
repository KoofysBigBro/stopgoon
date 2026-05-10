'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function sendInvite(partnerCode: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return { error: 'Not authenticated' };

  if (!partnerCode || partnerCode.trim() === '') {
    return { error: 'Please enter a valid connection code.' };
  }

  // 1. Find user by connection code (using an RPC function to bypass RLS)
  const { data: partnerId, error: partnerError } = await supabase
    .rpc('get_user_id_by_code', { p_code: partnerCode.toUpperCase() });

  if (partnerError || !partnerId) {
    return { error: 'Invalid connection code or user not found.' };
  }

  if (partnerId === user.id) {
    return { error: 'You cannot invite yourself.' };
  }

  // 2. Check if connection already exists
  const { data: existing } = await supabase
    .from('accountability_partners')
    .select('*')
    .or(`and(user1_id.eq.${user.id},user2_id.eq.${partnerId}),and(user1_id.eq.${partnerId},user2_id.eq.${user.id})`)
    .single();

  if (existing) {
    return { error: 'You are already linked or have a pending invite with this user.' };
  }

  // 3. Create the invite
  const { error: insertError } = await supabase
    .from('accountability_partners')
    .insert({
      user1_id: user.id,
      user2_id: partnerId,
      status: 'pending'
    });

  if (insertError) {
    return { error: 'Failed to send invite.' };
  }

  revalidatePath('/dashboard/accountability');
  return { success: true };
}

export async function respondToInvite(inviteId: string, action: 'accept' | 'reject') {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return { error: 'Not authenticated' };

  if (action === 'accept') {
    await supabase
      .from('accountability_partners')
      .update({ status: 'accepted' })
      .eq('id', inviteId)
      .eq('user2_id', user.id);
  } else {
    await supabase
      .from('accountability_partners')
      .delete()
      .eq('id', inviteId)
      .eq('user2_id', user.id);
  }

  revalidatePath('/dashboard/accountability');
  return { success: true };
}

export async function removePartner(partnershipId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return { error: 'Not authenticated' };

  await supabase
    .from('accountability_partners')
    .delete()
    .eq('id', partnershipId)
    .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`);

  revalidatePath('/dashboard/accountability');
  return { success: true };
}
