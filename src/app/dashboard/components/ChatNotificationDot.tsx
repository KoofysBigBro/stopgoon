'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

export default function ChatNotificationDot({ userId }: { userId: string }) {
  const [hasUnread, setHasUnread] = useState(false);
  const supabase = createClient();

  const checkUnread = async () => {
    // Get user's last seen timestamp
    const { data: profile } = await supabase
      .from('users')
      .select('last_seen_chat_at')
      .eq('id', userId)
      .single();

    const lastSeen = profile?.last_seen_chat_at || '2000-01-01T00:00:00Z';

    // Count messages newer than last seen
    const { count } = await supabase
      .from('chat_messages')
      .select('*', { count: 'exact', head: true })
      .eq('room_id', 'global')
      .neq('user_id', userId)
      .gt('created_at', lastSeen);

    setHasUnread((count ?? 0) > 0);
  };

  useEffect(() => {
    checkUnread();

    // Listen for new messages in real time
    const channel = supabase
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
          // If the new message is from someone else, show the dot
          if (payload.new && (payload.new as any).user_id !== userId) {
            setHasUnread(true);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  if (!hasUnread) return null;

  return (
    <span className="absolute right-3 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse shadow-lg shadow-red-500/50" />
  );
}
