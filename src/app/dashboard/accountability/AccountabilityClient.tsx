'use client';

import React, { useState } from 'react';
import { Users, Copy, Check, UserPlus, ShieldAlert, X, CheckCircle2 } from 'lucide-react';
import { sendInvite, respondToInvite, removePartner } from './actions';

export default function AccountabilityClient({
  userId,
  connectionCode,
  partnerships,
  isPremium
}: {
  userId: string;
  connectionCode: string;
  partnerships: any[];
  isPremium: boolean;
}) {
  const [inviteCode, setInviteCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const activePartners = partnerships.filter(p => p.status === 'accepted');
  const pendingReceived = partnerships.filter(p => p.status === 'pending' && p.user2_id === userId);
  const pendingSent = partnerships.filter(p => p.status === 'pending' && p.user1_id === userId);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(connectionCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await sendInvite(inviteCode);
    if (res.error) {
      setError(res.error);
    } else {
      setInviteCode('');
    }
    setLoading(false);
  };

  const handleRespond = async (id: string, action: 'accept' | 'reject') => {
    await respondToInvite(id, action);
  };

  const handleRemove = async (id: string) => {
    if (confirm('Are you sure you want to remove this partner?')) {
      await removePartner(id);
    }
  };

  return (
    <div className="space-y-8 relative">
      {!isPremium && (
        <div className="absolute inset-0 z-20 backdrop-blur-md bg-background/60 flex flex-col items-center justify-center p-6 text-center rounded-3xl border border-border">
          <div className="bg-indigo-500/20 p-4 rounded-full mb-4">
            <Users className="w-12 h-12 text-indigo-400" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Accountability Partners</h2>
          <p className="text-muted max-w-md mb-6">
            Upgrade to Premium to link your account with friends or an accountability partner. 
            Get notified if they relapse and keep each other on track.
          </p>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/25">
            Unlock Premium
          </button>
        </div>
      )}

      <div>
        <h1 className="text-3xl font-bold font-heading mb-2">Accountability</h1>
        <p className="text-muted">Link accounts with a trusted friend to keep each other on track.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Connection Code Card */}
        <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-indigo-400" />
            Your Connection Code
          </h2>
          <p className="text-sm text-muted mb-4">Share this 6-character code with your accountability partner so they can invite you.</p>
          
          <div className="flex items-center gap-3">
            <div className="bg-background border border-border rounded-xl px-4 py-3 flex-1 text-center font-mono text-2xl font-bold tracking-widest text-indigo-400">
              {connectionCode || '------'}
            </div>
            <button 
              onClick={handleCopyCode}
              className="bg-primary/10 hover:bg-primary/20 text-primary p-3 rounded-xl transition-colors"
            >
              {copied ? <Check className="w-6 h-6" /> : <Copy className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Invite Partner Card */}
        <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-indigo-400" />
            Add a Partner
          </h2>
          <p className="text-sm text-muted mb-4">Enter your partner's connection code to send them an accountability invite.</p>
          
          <form onSubmit={handleSendInvite} className="flex gap-3">
            <input 
              type="text" 
              placeholder="e.g. A1B2C3" 
              maxLength={6}
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
              className="bg-background border border-border rounded-xl px-4 py-3 flex-1 font-mono uppercase focus:outline-none focus:border-indigo-500"
            />
            <button 
              type="submit"
              disabled={loading || inviteCode.length < 6}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-bold transition-all"
            >
              Invite
            </button>
          </form>
          {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Active Partners */}
        <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            Active Partners
          </h2>
          
          {activePartners.length === 0 ? (
            <p className="text-muted text-sm text-center py-8">You don't have any active partners yet.</p>
          ) : (
            <div className="space-y-3">
              {activePartners.map(p => {
                const partnerEmail = p.user1_id === userId ? p.user2?.email : p.user1?.email;
                return (
                  <div key={p.id} className="flex items-center justify-between bg-background border border-border p-4 rounded-xl">
                    <div className="truncate pr-4">
                      <p className="font-bold truncate">{partnerEmail}</p>
                      <p className="text-xs text-muted">Linked Since: {new Date(p.created_at).toISOString().split('T')[0]}</p>
                    </div>
                    <button 
                      onClick={() => handleRemove(p.id)}
                      className="text-red-500 hover:bg-red-500/10 p-2 rounded-lg transition-colors flex-shrink-0"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Pending Invites */}
        <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold mb-4">Pending Invites</h2>
          
          {pendingReceived.length === 0 && pendingSent.length === 0 ? (
            <p className="text-muted text-sm text-center py-8">No pending invites.</p>
          ) : (
            <div className="space-y-4">
              {/* Received */}
              {pendingReceived.map(p => (
                <div key={p.id} className="bg-indigo-500/10 border border-indigo-500/20 p-4 rounded-xl">
                  <p className="text-sm mb-3"><span className="font-bold">{p.user1?.email}</span> invited you.</p>
                  <div className="flex gap-2">
                    <button onClick={() => handleRespond(p.id, 'accept')} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg text-sm font-bold transition-colors">Accept</button>
                    <button onClick={() => handleRespond(p.id, 'reject')} className="flex-1 bg-surface-hover hover:bg-border border border-border text-foreground py-2 rounded-lg text-sm font-bold transition-colors">Decline</button>
                  </div>
                </div>
              ))}
              
              {/* Sent */}
              {pendingSent.map(p => (
                <div key={p.id} className="flex items-center justify-between bg-background border border-border p-4 rounded-xl">
                  <div className="truncate pr-4">
                    <p className="font-medium text-sm truncate">Invited: {p.user2?.email}</p>
                    <p className="text-xs text-muted">Pending response</p>
                  </div>
                  <button 
                    onClick={() => handleRemove(p.id)}
                    className="text-red-500 hover:bg-red-500/10 p-2 rounded-lg transition-colors text-xs font-bold"
                  >
                    Cancel
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
