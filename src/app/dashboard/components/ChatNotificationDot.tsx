'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export default function ChatNotificationDot({ userId }: { userId: string }) {
  const [hasUnread, setHasUnread] = useState(false);
  const supabase = createClient();
  const pathname = usePathname();

  // If user is currently on the chat page, never show the dot
  const isOnChatPage = pathname === '/dashboard/chat';

  const checkUnread = async () => {
    if (isOnChatPage) {
      setHasUnread(false);
      return;
    }

    const { data: profile } = await supabase
      .from('users')
      .select('last_seen_chat_at')
      .eq('id', userId)
      .single();

    const lastSeen = profile?.last_seen_chat_at || '2000-01-01T00:00:00Z';

    const { count } = await supabase
      .from('chat_messages')
      .select('*', { count: 'exact', head: true })
      .eq('room_id', 'global')
      .neq('user_id', userId)
      .gt('created_at', lastSeen);

    setHasUnread((count ?? 0) > 0);
  };

  useEffect(() => {
    // When navigating TO the chat page, clear the dot and update last_seen
    if (isOnChatPage) {
      setHasUnread(false);
      supabase
        .from('users')
        .update({ last_seen_chat_at: new Date().toISOString() })
        .eq('id', userId)
        .then();
      return;
    }

    checkUnread();

    // Listen for new messages in real time
    let channel: ReturnType<typeof supabase.channel> | null = null;

    try {
      channel = supabase
        .channel('unread-notif')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'chat_messages',
            filter: 'room_id=eq.global',
          },
          (payload) => {
            if (payload.new && (payload.new as any).user_id !== userId && !isOnChatPage) {
              setHasUnread(true);
            }
          }
        )
        .subscribe();
    } catch (e) {
      console.warn('Failed to subscribe to realtime notifications', e);
    }

    return () => {
      try { if (channel) supabase.removeChannel(channel); } catch {}
    };
  }, [userId, isOnChatPage]);

  if (!hasUnread || isOnChatPage) return null;

  return (
    <span className="absolute right-3 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse shadow-lg shadow-red-500/50" />
  );
}
