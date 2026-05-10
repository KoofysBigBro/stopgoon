'use client';

import React, { useState, useEffect } from 'react';
import { Terminal, ShieldAlert, Key, Users, Zap, Database } from 'lucide-react';

export default function AdminPanel() {
  const [hasPremium, setHasPremium] = useState(false);
  const [showLogs, setShowLogs] = useState(false);

  useEffect(() => {
    // Check if we are faking premium in offline mode
    const isPremium = localStorage.getItem('dev_premium_override') === 'true';
    setHasPremium(isPremium);
  }, []);

  const togglePremium = () => {
    const newState = !hasPremium;
    setHasPremium(newState);
    if (newState) {
      localStorage.setItem('dev_premium_override', 'true');
      alert('Developer Power Activated: You now have Premium features unlocked locally!');
    } else {
      localStorage.removeItem('dev_premium_override');
      alert('Premium revoked.');
    }
    // Force a reload to apply changes across the app if we had real state binding
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 animate-in fade-in zoom-in-95 duration-500">
      
      <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 flex items-start gap-4">
        <ShieldAlert className="w-8 h-8 text-red-500 shrink-0 mt-1" />
        <div>
          <h1 className="text-2xl font-bold font-heading text-red-500 tracking-tight">Offline Developer Console</h1>
          <p className="text-sm text-red-400/80 mt-1">
            Warning: You are currently running in local offline mode. Changes made here will only affect your local browser environment.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* User Management Simulation */}
        <div className="bg-surface border border-border rounded-xl p-6 space-y-6">
          <div className="flex items-center gap-3 border-b border-border pb-4">
            <Users className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-bold font-heading">User Management</h2>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center bg-background p-4 rounded-lg border border-border">
              <div>
                <p className="font-semibold text-foreground">Marko (Offline Admin)</p>
                <p className="text-xs text-muted">ID: dev-user-id</p>
              </div>
              <span className={`px-2 py-1 text-xs font-bold rounded-full ${hasPremium ? 'bg-primary/20 text-primary' : 'bg-muted/20 text-muted'}`}>
                {hasPremium ? 'PREMIUM' : 'FREE'}
              </span>
            </div>

            <button 
              onClick={togglePremium}
              className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                hasPremium 
                  ? 'bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20' 
                  : 'bg-primary hover:bg-primary-hover text-white shadow-md shadow-primary/20'
              }`}
            >
              <Key className="w-4 h-4" />
              {hasPremium ? 'Revoke Premium Status' : 'Force Grant Premium Status'}
            </button>
          </div>
        </div>

        {/* System Status Simulation */}
        <div className="bg-surface border border-border rounded-xl p-6 space-y-6">
          <div className="flex items-center gap-3 border-b border-border pb-4">
            <Database className="w-6 h-6 text-green-500" />
            <h2 className="text-xl font-bold font-heading">System Status</h2>
          </div>

          <div className="space-y-3">
            <StatusRow label="Supabase Connection" status="OFFLINE" color="text-red-500" />
            <StatusRow label="Authentication" status="BYPASSED" color="text-yellow-500" />
            <StatusRow label="Lemon Squeezy API" status="CONNECTED" color="text-green-500" />
            <StatusRow label="Environment" status="DEVELOPMENT" color="text-primary" />
          </div>

          <button 
            onClick={() => setShowLogs(!showLogs)}
            className="w-full py-2 text-sm text-muted hover:text-foreground border border-border rounded-lg flex items-center justify-center gap-2"
          >
            <Terminal className="w-4 h-4" />
            {showLogs ? 'Hide System Logs' : 'View System Logs'}
          </button>
        </div>
      </div>

      {showLogs && (
        <div className="bg-black border border-border rounded-xl p-4 font-mono text-xs space-y-2 text-green-400">
          <p>{`> [System] Offline development mode activated.`}</p>
          <p>{`> [Auth] Middleware proxy.ts bypass successful.`}</p>
          <p>{`> [Billing] Lemon Squeezy initialized with store ID 371346.`}</p>
          <p>{`> [Admin] Awaiting developer overrides...`}</p>
        </div>
      )}

    </div>
  );
}

function StatusRow({ label, status, color }: { label: string, status: string, color: string }) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-muted">{label}</span>
      <span className={`font-bold ${color}`}>{status}</span>
    </div>
  )
}
