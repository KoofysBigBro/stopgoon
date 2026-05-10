'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@/utils/supabase/client';
import { MessageCircle, Send, Globe, Lock, Users, Shield, VolumeX, Ban, Clock } from 'lucide-react';

interface Partner {
  id: string;
  email: string;
  username: string;
  roomId: string;
}

interface ChatMessage {
  id: string;
  user_id: string;
  content: string;
  sender_email: string;
  sender_username: string;
  room_id: string;
  created_at: string;
}

export default function ChatClient({
  userId,
  userEmail,
  userUsername,
  userAvatarUrl,
  isPremium,
  isAdmin,
  isMuted,
  isBanned,
  partners,
}: {
  userId: string;
  userEmail: string;
  userUsername: string;
  userAvatarUrl: string | null;
  isPremium: boolean;
  isAdmin: boolean;
  isMuted: boolean;
  isBanned: boolean;
  partners: Partner[];
}) {
  const supabase = createClient();
  const [activeRoom, setActiveRoom] = useState('global');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [cooldownRemaining, setCooldownRemaining] = useState(0);
  const [lastSentAt, setLastSentAt] = useState(0);
  const [adminMenuOpen, setAdminMenuOpen] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const GLOBAL_COOLDOWN_MS = 5000; // 5 seconds for global chat

  // Cooldown timer
  useEffect(() => {
    if (cooldownRemaining <= 0) return;
    const timer = setInterval(() => {
      const remaining = Math.max(0, GLOBAL_COOLDOWN_MS - (Date.now() - lastSentAt));
      setCooldownRemaining(remaining);
    }, 100);
    return () => clearInterval(timer);
  }, [cooldownRemaining, lastSentAt]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Load messages for the active room
  useEffect(() => {
    const loadMessages = async () => {
      const { data } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('room_id', activeRoom)
        .order('created_at', { ascending: true })
        .limit(100);

      setMessages(data || []);
      setTimeout(scrollToBottom, 100);
    };

    loadMessages();

    const channel = supabase
      .channel(`chat-${activeRoom}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `room_id=eq.${activeRoom}`,
        },
        (payload) => {
          const newMsg = payload.new as ChatMessage;
          setMessages((prev) => [...prev, newMsg]);
          setTimeout(scrollToBottom, 100);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeRoom]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    // Check if banned or muted
    if (isBanned) return;
    if (isMuted) return;

    // Check cooldown for global chat
    if (activeRoom === 'global') {
      const timeSinceLast = Date.now() - lastSentAt;
      if (timeSinceLast < GLOBAL_COOLDOWN_MS) {
        setCooldownRemaining(GLOBAL_COOLDOWN_MS - timeSinceLast);
        return;
      }
    }

    setSending(true);
    const { error } = await supabase.from('chat_messages').insert({
      user_id: userId,
      content: newMessage.trim(),
      sender_email: userEmail,
      sender_username: userUsername,
      room_id: activeRoom,
    });

    if (!error) {
      setNewMessage('');
      if (activeRoom === 'global') {
        setLastSentAt(Date.now());
        setCooldownRemaining(GLOBAL_COOLDOWN_MS);
      }
    }
    setSending(false);
  };

  // Admin actions
  const handleMuteUser = async (targetUserId: string) => {
    await supabase.rpc('admin_mute_user', { target_user_id: targetUserId, mute_duration_hours: 24 });
    setAdminMenuOpen(null);
  };

  const handleBanUser = async (targetUserId: string) => {
    if (confirm('Are you sure you want to ban this user?')) {
      await supabase.rpc('admin_ban_user', { target_user_id: targetUserId, reason: 'Violation of community guidelines' });
      setAdminMenuOpen(null);
    }
  };

  const activePartner = partners.find((p) => p.roomId === activeRoom);
  const roomLabel = activeRoom === 'global' ? 'Global Community' : activePartner?.username || 'Direct Message';

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const cooldownSeconds = Math.ceil(cooldownRemaining / 1000);

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] md:h-[calc(100vh-3rem)]">
      <div className="mb-4">
        <h1 className="text-3xl font-bold font-heading mb-1">Community</h1>
        <p className="text-muted text-sm">Talk with others on the same journey. You are not alone.</p>
      </div>

      {/* Banned overlay */}
      {isBanned && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center p-8 bg-red-500/10 border border-red-500/20 rounded-2xl max-w-md">
            <Ban className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-red-500 mb-2">Account Suspended</h2>
            <p className="text-muted text-sm">Your account has been suspended from the community chat. If you believe this is a mistake, please contact support.</p>
          </div>
        </div>
      )}

      {!isBanned && (
        <div className="flex flex-1 gap-4 min-h-0 overflow-hidden">
          {/* Sidebar: Room List */}
          <div className="w-56 flex-shrink-0 bg-surface border border-border rounded-2xl p-3 flex flex-col gap-1 overflow-y-auto hidden md:flex">
            <p className="text-xs font-bold text-muted uppercase tracking-wider px-3 py-2">Channels</p>

            <button
              onClick={() => setActiveRoom('global')}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left ${
                activeRoom === 'global'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                  : 'text-muted hover:bg-surface-hover hover:text-foreground'
              }`}
            >
              <Globe className="w-4 h-4 flex-shrink-0" />
              Global Chat
            </button>

            {partners.length > 0 && (
              <>
                <p className="text-xs font-bold text-muted uppercase tracking-wider px-3 py-2 mt-3">Direct Messages</p>
                {partners.map((p) => (
                  <button
                    key={p.roomId}
                    onClick={() => setActiveRoom(p.roomId)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left ${
                      activeRoom === p.roomId
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                        : 'text-muted hover:bg-surface-hover hover:text-foreground'
                    }`}
                  >
                    <Lock className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{p.username || p.email.split('@')[0]}</span>
                  </button>
                ))}
              </>
            )}

            {partners.length === 0 && (
              <div className="px-3 py-4 text-center">
                <Users className="w-8 h-8 text-muted mx-auto mb-2 opacity-40" />
                <p className="text-xs text-muted">Add a partner to unlock private DMs</p>
              </div>
            )}

            {isAdmin && (
              <>
                <p className="text-xs font-bold text-muted uppercase tracking-wider px-3 py-2 mt-3">
                  <Shield className="w-3 h-3 inline mr-1" />
                  Admin
                </p>
                <p className="text-xs text-muted px-3">Click usernames in chat to moderate</p>
              </>
            )}
          </div>

          {/* Mobile Room Tabs */}
          <div className="flex md:hidden gap-2 mb-2 overflow-x-auto pb-1 flex-shrink-0">
            <button
              onClick={() => setActiveRoom('global')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeRoom === 'global'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-surface border border-border text-muted'
              }`}
            >
              <Globe className="w-4 h-4" />
              Global
            </button>
            {partners.map((p) => (
              <button
                key={p.roomId}
                onClick={() => setActiveRoom(p.roomId)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  activeRoom === p.roomId
                    ? 'bg-indigo-600 text-white'
                    : 'bg-surface border border-border text-muted'
                }`}
              >
                <Lock className="w-3 h-3" />
                {p.username || p.email.split('@')[0]}
              </button>
            ))}
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col bg-surface border border-border rounded-2xl overflow-hidden min-h-0">
            {/* Chat Header */}
            <div className="px-5 py-3 border-b border-border flex items-center gap-3 flex-shrink-0">
              <div className={`p-2 rounded-lg ${activeRoom === 'global' ? 'bg-emerald-500/15' : 'bg-indigo-500/15'}`}>
                {activeRoom === 'global' ? (
                  <Globe className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Lock className="w-4 h-4 text-indigo-400" />
                )}
              </div>
              <div>
                <p className="font-bold text-sm">{roomLabel}</p>
                <p className="text-xs text-muted">
                  {activeRoom === 'global'
                    ? 'Everyone can see these messages • 5s cooldown'
                    : 'Only you and your partner can see these'}
                </p>
              </div>
            </div>

            {/* Messages */}
            <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <MessageCircle className="w-12 h-12 text-muted opacity-30 mb-3" />
                  <p className="text-muted text-sm">No messages yet. Be the first to say hi!</p>
                </div>
              ) : (
                messages.map((msg) => {
                  const isOwn = msg.user_id === userId;
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}
                    >
                      <div className={`flex items-center gap-1.5 mb-1 ${isOwn ? 'flex-row-reverse' : ''}`}>
                        <p className={`text-xs font-medium ${isOwn ? 'text-indigo-400' : 'text-muted'}`}>
                          {isOwn ? 'You' : (msg.sender_username || msg.sender_email?.split('@')[0] || 'Anonymous')}
                        </p>
                        {/* Admin moderation button */}
                        {isAdmin && !isOwn && (
                          <div className="relative">
                            <button
                              onClick={() => setAdminMenuOpen(adminMenuOpen === msg.id ? null : msg.id)}
                              className="text-muted hover:text-amber-500 transition-colors"
                              title="Moderate user"
                            >
                              <Shield className="w-3 h-3" />
                            </button>
                            {adminMenuOpen === msg.id && (
                              <div className="absolute z-50 top-5 left-0 bg-surface border border-border rounded-xl shadow-xl p-2 min-w-[160px] space-y-1">
                                <button
                                  onClick={() => handleMuteUser(msg.user_id)}
                                  className="flex items-center gap-2 w-full px-3 py-2 text-xs font-medium rounded-lg hover:bg-amber-500/10 text-amber-500 transition-colors"
                                >
                                  <VolumeX className="w-3.5 h-3.5" />
                                  Mute 24h
                                </button>
                                <button
                                  onClick={() => handleBanUser(msg.user_id)}
                                  className="flex items-center gap-2 w-full px-3 py-2 text-xs font-medium rounded-lg hover:bg-red-500/10 text-red-500 transition-colors"
                                >
                                  <Ban className="w-3.5 h-3.5" />
                                  Ban User
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      <div
                        className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                          isOwn
                            ? 'bg-indigo-600 text-white rounded-br-md'
                            : 'bg-background border border-border text-foreground rounded-bl-md'
                        }`}
                      >
                        {msg.content}
                      </div>
                      <p className="text-[10px] text-muted mt-1">{formatTime(msg.created_at)}</p>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-border flex gap-3 flex-shrink-0 items-center">
              {isMuted ? (
                <div className="flex-1 flex items-center gap-2 text-amber-500 text-sm px-4 py-3">
                  <VolumeX className="w-4 h-4" />
                  You are currently muted.
                </div>
              ) : (
                <>
                  <input
                    type="text"
                    placeholder={activeRoom === 'global' ? 'Message the community...' : `Message ${activePartner?.username || 'partner'}...`}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    maxLength={500}
                    className="flex-1 bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                  {cooldownRemaining > 0 && activeRoom === 'global' ? (
                    <div className="flex items-center gap-1.5 text-muted text-sm px-3">
                      <Clock className="w-4 h-4" />
                      {cooldownSeconds}s
                    </div>
                  ) : (
                    <button
                      type="submit"
                      disabled={!newMessage.trim() || sending}
                      className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white p-3 rounded-xl transition-all"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  )}
                </>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
