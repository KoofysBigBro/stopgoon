import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { getClientIp } from '@/utils/request';
import { rateLimit } from '@/utils/rate-limit';
import { filterMessageContent } from '@/utils/chat-moderation';
import { logApiError } from '@/utils/api-error';

const GLOBAL_ROOM = 'global';
const MESSAGE_LIMIT = 500;

function normalizeRoomId(value: unknown): string {
  if (typeof value !== 'string') return GLOBAL_ROOM;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : GLOBAL_ROOM;
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const ip = getClientIp(request);
    const ipRate = rateLimit(`chat:ip:${ip}`, 40, 60000);
    const userRate = rateLimit(`chat:user:${user.id}`, 20, 60000);
    if (!ipRate.allowed || !userRate.allowed) {
      return NextResponse.json({ error: 'Too Many Requests' }, { status: 429, headers: { 'Retry-After': '60' } });
    }

    const body = await request.json().catch(() => ({}));
    const content = typeof body?.content === 'string' ? body.content.trim() : '';
    const roomId = normalizeRoomId(body?.roomId);

    if (!content) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    if (content.length > MESSAGE_LIMIT) {
      return NextResponse.json({ error: 'Message is too long' }, { status: 400 });
    }

    const { data: profile } = await supabase
      .from('users')
      .select('username, avatar_url, role, is_muted, muted_until, is_banned')
      .eq('id', user.id)
      .single();

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    if (profile.is_banned) {
      return NextResponse.json({ error: 'Account suspended from chat' }, { status: 403 });
    }

    if (profile.is_muted) {
      const mutedUntil = profile.muted_until ? new Date(profile.muted_until).getTime() : null;
      if (mutedUntil && mutedUntil <= Date.now()) {
        await supabase.from('users').update({ is_muted: false, muted_until: null }).eq('id', user.id);
      } else {
        return NextResponse.json({ error: 'You are currently muted' }, { status: 403 });
      }
    }

    if (roomId !== GLOBAL_ROOM) {
      const roomParts = roomId.split('_');
      if (roomParts.length !== 2 || !roomParts.includes(user.id)) {
        return NextResponse.json({ error: 'Invalid room' }, { status: 403 });
      }

      const partnerId = roomParts[0] === user.id ? roomParts[1] : roomParts[0];
      const { data: partnership } = await supabase
        .from('accountability_partners')
        .select('id')
        .eq('status', 'accepted')
        .or(`and(user1_id.eq.${user.id},user2_id.eq.${partnerId}),and(user1_id.eq.${partnerId},user2_id.eq.${user.id})`)
        .maybeSingle();

      if (!partnership) {
        return NextResponse.json({ error: 'You can only message accepted partners' }, { status: 403 });
      }
    }

    const filteredContent = filterMessageContent(content);
    const senderUsername = profile.username || user.email?.split('@')[0] || 'Anonymous';

    const { error } = await supabase.from('chat_messages').insert({
      user_id: user.id,
      content: filteredContent,
      sender_email: user.email || 'Anonymous',
      sender_username: senderUsername,
      sender_avatar_url: profile.avatar_url,
      sender_role: profile.role || 'user',
      room_id: roomId,
    });

    if (error) {
      logApiError('/api/chat/send', error, { stage: 'insert_message', userId: user.id, roomId });
      return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    logApiError('/api/chat/send', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
