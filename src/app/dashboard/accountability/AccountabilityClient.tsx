'use client';

import React, { useState } from 'react';
import { Users, Copy, Check, UserPlus, ShieldAlert, X, CheckCircle2, Send, MessageSquareShare } from 'lucide-react';
import { sendInvite, respondToInvite, removePartner } from './actions';
import PageHeader from '../components/ui/PageHeader';
import SectionCard from '../components/ui/SectionCard';
import PrimaryButton from '../components/ui/PrimaryButton';

export default function AccountabilityClient({
  userId,
  connectionCode,
  partnerships,
  isPremium
}: {
  userId: string;
  connectionCode: string;
  partnerships: Array<{
    id: string;
    status: 'pending' | 'accepted' | 'rejected';
    user1_id: string;
    user2_id: string;
    created_at: string;
    user1?: { email?: string | null };
    user2?: { email?: string | null };
  }>;
  isPremium: boolean;
}) {
  const [inviteCode, setInviteCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedPing, setCopiedPing] = useState(false);

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

  const quickPing = `Quick progress ping: I checked in today and stayed aligned with my recovery plan. Keep me accountable for tomorrow too.`;

  const copyQuickPing = async () => {
    await navigator.clipboard.writeText(quickPing);
    setCopiedPing(true);
    setTimeout(() => setCopiedPing(false), 1800);
  };

  return (
    <div className="space-y-8 relative min-h-[600px]">
      {!isPremium && (
        <div className="absolute inset-0 z-20 backdrop-blur-md bg-background/60 flex flex-col items-center justify-center p-6 text-center rounded-3xl border border-amber-500/30 shadow-lg shadow-amber-500/10">
          <div className="bg-amber-500/20 p-4 rounded-full mb-4">
            <Users className="w-12 h-12 text-amber-400" />
          </div>
          <div className="bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-4 shadow-md">
            PREMIUM FEATURE
          </div>
          <h2 className="text-2xl font-bold mb-2">Accountability Partners</h2>
          <p className="text-muted max-w-md mb-6">
            Upgrade to Premium to link your account with friends or an accountability partner. 
            Get notified if they relapse and keep each other on track.
          </p>
          <a href="/dashboard/upgrade" className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-amber-500/25 hover:scale-105">
            Unlock Premium
          </a>
        </div>
      )}

      <PageHeader
        title="Accountability"
        subtitle="Link accounts with a trusted friend to keep each other on track."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Connection Code Card */}
        <SectionCard>
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
              aria-label="Copy connection code"
            >
              {copied ? <Check className="w-6 h-6" /> : <Copy className="w-6 h-6" />}
            </button>
          </div>
        </SectionCard>

        {/* Invite Partner Card */}
        <SectionCard>
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-indigo-400" />
            Add a Partner
          </h2>
          <p className="text-sm text-muted mb-4">Enter your partner&apos;s connection code to send them an accountability invite.</p>
          
          <form onSubmit={handleSendInvite} className="flex gap-3">
            <input 
              type="text" 
              placeholder="e.g. A1B2C3" 
              maxLength={6}
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
              className="bg-background border border-border rounded-xl px-4 py-3 flex-1 font-mono uppercase focus:outline-none focus:border-indigo-500"
              aria-label="Partner connection code"
            />
            <PrimaryButton
              type="submit"
              disabled={loading || inviteCode.length < 6}
              className="px-6 py-3"
            >
              Invite
            </PrimaryButton>
          </form>
          {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
        </SectionCard>
      </div>

      <SectionCard>
        <h2 className="text-lg font-bold mb-2 flex items-center gap-2">
          <MessageSquareShare className="w-5 h-5 text-primary" />
          Accountability Loop
        </h2>
        <p className="text-sm text-muted mb-4">Send a one-click progress ping to your partner after a check-in so accountability stays active.</p>
        <div className="bg-background border border-border rounded-xl p-4 text-sm text-foreground mb-4">
          {quickPing}
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={copyQuickPing} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white font-bold hover:bg-primary-hover transition-colors">
            {copiedPing ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copiedPing ? 'Copied' : 'Copy Ping'}
          </button>
          <a
            href={`mailto:?subject=${encodeURIComponent('StopGoon Progress Ping')}&body=${encodeURIComponent(quickPing)}`}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border font-bold hover:bg-surface-hover transition-colors"
          >
            <Send className="w-4 h-4" /> Send by Email
          </a>
        </div>
      </SectionCard>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Active Partners */}
        <SectionCard>
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            Active Partners
          </h2>
          
          {activePartners.length === 0 ? (
            <p className="text-muted text-sm text-center py-8">You don&apos;t have any active partners yet.</p>
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
                      aria-label={`Remove partner ${partnerEmail}`}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </SectionCard>

        {/* Pending Invites */}
        <SectionCard>
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
        </SectionCard>
      </div>
    </div>
  );
}
