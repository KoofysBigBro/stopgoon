'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@/utils/supabase/client';
import { MessageCircle, Send, Globe, Lock, Users, Shield, VolumeX, Volume2, Ban, Clock, Trash2, X, Crown, BookHeart, CalendarCheck, Flame, UserCheck } from 'lucide-react';

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
  sender_avatar_url: string | null;
  sender_role: string;
  room_id: string;
  created_at: string;
}

interface UserProfile {
  username: string;
  avatar_url: string | null;
  is_public: boolean;
  role: string;
  created_at: string;
}

interface UserStats {
  journal_count: number;
  checkin_count: number;
  days_since_relapse: number;
}

export default function ChatClient({
  userId,
  userEmail,
  userUsername,
  userAvatarUrl,
  userRole,
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
  userRole: string;
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
  const [profilePopup, setProfilePopup] = useState<{ profile: UserProfile; stats: UserStats | null; targetId: string } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const GLOBAL_COOLDOWN_MS = 5000;
  const canModerate = userRole === 'admin' || userRole === 'owner';

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
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'chat_messages',
        filter: `room_id=eq.${activeRoom}`,
      }, (payload) => {
        setMessages((prev) => [...prev, payload.new as ChatMessage]);
        setTimeout(scrollToBottom, 100);
      })
      .on('postgres_changes', {
        event: 'DELETE',
        schema: 'public',
        table: 'chat_messages',
      }, (payload) => {
        setMessages((prev) => prev.filter(m => m.id !== (payload.old as any).id));
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [activeRoom]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || sending || isBanned || isMuted) return;

    if (activeRoom === 'global') {
      const timeSinceLast = Date.now() - lastSentAt;
      if (timeSinceLast < GLOBAL_COOLDOWN_MS) {
        setCooldownRemaining(GLOBAL_COOLDOWN_MS - timeSinceLast);
        return;
      }
    }

    setSending(true);
    await supabase.from('chat_messages').insert({
      user_id: userId,
      content: newMessage.trim(),
      sender_email: userEmail,
      sender_username: userUsername,
      sender_avatar_url: userAvatarUrl,
      sender_role: userRole,
      room_id: activeRoom,
    });

    setNewMessage('');
    if (activeRoom === 'global') {
      setLastSentAt(Date.now());
      setCooldownRemaining(GLOBAL_COOLDOWN_MS);
    }
    setSending(false);
  };

  const handleDeleteMessage = async (messageId: string) => {
    await supabase.rpc('admin_delete_message', { message_id: messageId });
    setMessages((prev) => prev.filter(m => m.id !== messageId));
    setAdminMenuOpen(null);
  };

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

  const handleUnmuteUser = async (targetUserId: string) => {
    await supabase.rpc('admin_unmute_user', { target_user_id: targetUserId });
    setAdminMenuOpen(null);
  };

  const handleUnbanUser = async (targetUserId: string) => {
    await supabase.rpc('admin_unban_user', { target_user_id: targetUserId });
    setAdminMenuOpen(null);
  };

  const handleAvatarClick = async (targetUserId: string) => {
    if (targetUserId === userId) return;
    // Fetch public profile
    const { data: profileData } = await supabase.rpc('get_public_profile', { target_user_id: targetUserId });
    if (!profileData || profileData.length === 0) return;
    const profile = profileData[0] as UserProfile;

    let stats: UserStats | null = null;
    if (profile.is_public) {
      const { data: statsData } = await supabase.rpc('get_public_stats', { target_user_id: targetUserId });
      if (statsData && statsData.length > 0) {
        stats = statsData[0] as UserStats;
      }
    }

    setProfilePopup({ profile, stats, targetId: targetUserId });
  };

  const getRoleIcon = (role: string) => {
    if (role === 'owner') return <Crown className="w-3.5 h-3.5 text-amber-400 inline" />;
    if (role === 'admin') return <Shield className="w-3.5 h-3.5 text-indigo-400 inline" />;
    return null;
  };

  const getRoleBadge = (role: string) => {
    if (role === 'owner') return (
      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-bold uppercase tracking-wider">
        <Crown className="w-2.5 h-2.5" />
        Owner
      </span>
    );
    if (role === 'admin') return (
      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 text-[10px] font-bold uppercase tracking-wider">
        <Shield className="w-2.5 h-2.5" />
        Admin
      </span>
    );
    return null;
  };

  const activePartner = partners.find((p) => p.roomId === activeRoom);
  const roomLabel = activeRoom === 'global' ? 'Global Community' : activePartner?.username || 'Direct Message';
  const formatTime = (iso: string) => new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const cooldownSeconds = Math.ceil(cooldownRemaining / 1000);

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] md:h-[calc(100vh-3rem)]">
      {/* Profile Popup Modal */}
      {profilePopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setProfilePopup(null)}>
          <div className="bg-surface border border-border rounded-2xl p-6 w-[340px] shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-indigo-500/10 border-2 border-border overflow-hidden flex items-center justify-center flex-shrink-0">
                  {profilePopup.profile.avatar_url ? (
                    <img src={profilePopup.profile.avatar_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xl font-bold text-muted">{profilePopup.profile.username?.[0]?.toUpperCase() || '?'}</span>
                  )}
                </div>
                <div>
                  <p className="font-bold flex items-center gap-1.5 flex-wrap">
                    {profilePopup.profile.username}
                    {getRoleBadge(profilePopup.profile.role)}
                  </p>
                  <p className="text-xs text-muted">Member since {new Date(profilePopup.profile.created_at).toISOString().split('T')[0]}</p>
                </div>
              </div>
              <button onClick={() => setProfilePopup(null)} className="text-muted hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            {profilePopup.profile.is_public && profilePopup.stats ? (
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-background border border-border rounded-xl p-3 text-center">
                  <Flame className="w-5 h-5 text-orange-400 mx-auto mb-1" />
                  <p className="text-lg font-bold">{profilePopup.stats.days_since_relapse ?? 0}</p>
                  <p className="text-[10px] text-muted">Day Streak</p>
                </div>
                <div className="bg-background border border-border rounded-xl p-3 text-center">
                  <BookHeart className="w-5 h-5 text-indigo-400 mx-auto mb-1" />
                  <p className="text-lg font-bold">{profilePopup.stats.journal_count ?? 0}</p>
                  <p className="text-[10px] text-muted">Journals</p>
                </div>
                <div className="bg-background border border-border rounded-xl p-3 text-center">
                  <CalendarCheck className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
                  <p className="text-lg font-bold">{profilePopup.stats.checkin_count ?? 0}</p>
                  <p className="text-[10px] text-muted">Check-ins</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-4 bg-background border border-border rounded-xl">
                <Lock className="w-6 h-6 text-muted mx-auto mb-2" />
                <p className="text-sm text-muted">This profile is private</p>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="mb-4">
        <h1 className="text-3xl font-bold font-heading mb-1">Community</h1>
        <p className="text-muted text-sm">Talk with others on the same journey. You are not alone.</p>
      </div>

      {isBanned ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center p-8 bg-red-500/10 border border-red-500/20 rounded-2xl max-w-md">
            <Ban className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-red-500 mb-2">Account Suspended</h2>
            <p className="text-muted text-sm">Your account has been suspended from the community chat.</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-1 gap-4 min-h-0 overflow-hidden">
          {/* Sidebar */}
          <div className="w-56 flex-shrink-0 bg-surface border border-border rounded-2xl p-3 flex flex-col gap-1 overflow-y-auto hidden md:flex">
            <p className="text-xs font-bold text-muted uppercase tracking-wider px-3 py-2">Channels</p>
            <button onClick={() => setActiveRoom('global')} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left ${activeRoom === 'global' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-muted hover:bg-surface-hover hover:text-foreground'}`}>
              <Globe className="w-4 h-4 flex-shrink-0" /> Global Chat
            </button>

            {partners.length > 0 && (
              <>
                <p className="text-xs font-bold text-muted uppercase tracking-wider px-3 py-2 mt-3">Direct Messages</p>
                {partners.map(p => (
                  <button key={p.roomId} onClick={() => setActiveRoom(p.roomId)} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left ${activeRoom === p.roomId ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-muted hover:bg-surface-hover hover:text-foreground'}`}>
                    <Lock className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{p.username || p.email.split('@')[0]}</span>
                  </button>
                ))}
              </>
            )}

            {partners.length === 0 && (
              <div className="px-3 py-4 text-center">
                <Users className="w-8 h-8 text-muted mx-auto mb-2 opacity-40" />
                <p className="text-xs text-muted">Add a partner to unlock DMs</p>
              </div>
            )}

            {canModerate && (
              <div className="mt-3 px-3 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
                <p className="text-xs font-bold text-indigo-400 flex items-center gap-1">
                  {userRole === 'owner' ? <Crown className="w-3 h-3" /> : <Shield className="w-3 h-3" />}
                  {userRole === 'owner' ? 'Owner Mode' : 'Admin Mode'}
                </p>
                <p className="text-[10px] text-muted mt-0.5">Click shield icons to moderate</p>
              </div>
            )}
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col bg-surface border border-border rounded-2xl overflow-hidden min-h-0">
            <div className="px-5 py-3 border-b border-border flex items-center gap-3 flex-shrink-0">
              <div className={`p-2 rounded-lg ${activeRoom === 'global' ? 'bg-emerald-500/15' : 'bg-indigo-500/15'}`}>
                {activeRoom === 'global' ? <Globe className="w-4 h-4 text-emerald-400" /> : <Lock className="w-4 h-4 text-indigo-400" />}
              </div>
              <div>
                <p className="font-bold text-sm">{roomLabel}</p>
                <p className="text-xs text-muted">
                  {activeRoom === 'global' ? 'Everyone can see these messages • 5s cooldown' : 'Only you and your partner can see these'}
                </p>
              </div>
            </div>

            <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <MessageCircle className="w-12 h-12 text-muted opacity-30 mb-3" />
                  <p className="text-muted text-sm">No messages yet. Be the first to say hi!</p>
                </div>
              ) : (
                messages.map((msg) => {
                  const isOwn = msg.user_id === userId;
                  return (
                    <div key={msg.id} className={`flex gap-2.5 ${isOwn ? 'flex-row-reverse' : ''}`}>
                      {/* Avatar */}
                      <button
                        onClick={() => handleAvatarClick(msg.user_id)}
                        className={`w-9 h-9 rounded-full border-2 overflow-hidden flex-shrink-0 hover:ring-2 hover:ring-indigo-500/50 transition-all cursor-pointer ${
                          msg.sender_role === 'owner' ? 'border-amber-500/60 bg-amber-500/20' : msg.sender_role === 'admin' ? 'border-indigo-500/60 bg-indigo-500/20' : 'border-border bg-slate-600'
                        }`}
                        title={`View ${msg.sender_username}'s profile`}
                      >
                        {msg.sender_avatar_url ? (
                          <img src={msg.sender_avatar_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <span className="flex items-center justify-center w-full h-full text-sm font-bold text-white">
                            {(msg.sender_username || '?')[0]?.toUpperCase()}
                          </span>
                        )}
                      </button>

                      {/* Message content */}
                      <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'} max-w-[75%]`}>
                        <div className={`flex items-center gap-1.5 mb-0.5 ${isOwn ? 'flex-row-reverse' : ''}`}>
                          <p className={`text-xs font-semibold flex items-center gap-1 ${
                            msg.sender_role === 'owner' ? 'text-amber-400' : msg.sender_role === 'admin' ? 'text-indigo-400' : isOwn ? 'text-indigo-400' : 'text-muted'
                          }`}>
                            {getRoleIcon(msg.sender_role)}
                            {isOwn ? 'You' : (msg.sender_username || 'Anonymous')}
                          </p>
                          {/* Admin controls */}
                          {canModerate && !isOwn && (
                            <div className="relative">
                              <button onClick={() => setAdminMenuOpen(adminMenuOpen === msg.id ? null : msg.id)} className="text-muted hover:text-amber-500 transition-colors">
                                <Shield className="w-3 h-3" />
                              </button>
                              {adminMenuOpen === msg.id && (
                                <div className="absolute z-50 top-5 left-0 bg-surface border border-border rounded-xl shadow-xl p-2 min-w-[180px] space-y-1">
                                  <button onClick={() => handleDeleteMessage(msg.id)} className="flex items-center gap-2 w-full px-3 py-2 text-xs font-medium rounded-lg hover:bg-red-500/10 text-red-500 transition-colors">
                                    <Trash2 className="w-3.5 h-3.5" /> Delete Message
                                  </button>
                                  <div className="border-t border-border my-1" />
                                  <button onClick={() => handleMuteUser(msg.user_id)} className="flex items-center gap-2 w-full px-3 py-2 text-xs font-medium rounded-lg hover:bg-amber-500/10 text-amber-500 transition-colors">
                                    <VolumeX className="w-3.5 h-3.5" /> Mute 24h
                                  </button>
                                  <button onClick={() => handleUnmuteUser(msg.user_id)} className="flex items-center gap-2 w-full px-3 py-2 text-xs font-medium rounded-lg hover:bg-emerald-500/10 text-emerald-500 transition-colors">
                                    <Volume2 className="w-3.5 h-3.5" /> Unmute
                                  </button>
                                  <div className="border-t border-border my-1" />
                                  <button onClick={() => handleBanUser(msg.user_id)} className="flex items-center gap-2 w-full px-3 py-2 text-xs font-medium rounded-lg hover:bg-red-500/10 text-red-500 transition-colors">
                                    <Ban className="w-3.5 h-3.5" /> Ban User
                                  </button>
                                  <button onClick={() => handleUnbanUser(msg.user_id)} className="flex items-center gap-2 w-full px-3 py-2 text-xs font-medium rounded-lg hover:bg-emerald-500/10 text-emerald-500 transition-colors">
                                    <UserCheck className="w-3.5 h-3.5" /> Unban User
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                          isOwn ? 'bg-indigo-600 text-white rounded-br-md' : 'bg-background border border-border text-foreground rounded-bl-md'
                        }`}>
                          {msg.content}
                        </div>
                        <p className="text-[10px] text-muted mt-0.5">{formatTime(msg.created_at)}</p>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="p-3 border-t border-border flex gap-3 flex-shrink-0 items-center">
              {isMuted ? (
                <div className="flex-1 flex items-center gap-2 text-amber-500 text-sm px-4 py-3">
                  <VolumeX className="w-4 h-4" /> You are currently muted.
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
                      <Clock className="w-4 h-4" /> {cooldownSeconds}s
                    </div>
                  ) : (
                    <button type="submit" disabled={!newMessage.trim() || sending} className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white p-3 rounded-xl transition-all">
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
