'use client';

import React, { useState } from 'react';

import { Sparkles, Loader2, Lock } from 'lucide-react';
import Link from 'next/link';

interface AICoachProps {
  isPremium: boolean;
}

export default function AICoach({ isPremium }: AICoachProps) {
  const [completion, setCompletion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasStarted, setHasStarted] = useState(false);

  const handleGenerate = async () => {
    setHasStarted(true);
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/ai/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: 'Can you analyze my recent journal entries and urge logs to give me personalized advice?' })
      });
      
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Failed to generate');
      }
      
      const data = await res.json();
      setCompletion(data.text);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-transparent border border-indigo-500/20 rounded-2xl p-6 shadow-sm relative overflow-hidden min-h-[250px] flex flex-col justify-center">
      
      {/* Premium Lock Overlay */}
      {!isPremium && (
        <div className="absolute inset-0 z-10 backdrop-blur-sm bg-background/50 flex flex-col items-center justify-center p-6 text-center">
          <div className="bg-indigo-600 w-12 h-12 rounded-full flex items-center justify-center shadow-lg shadow-indigo-600/30 mb-4">
            <Lock className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-bold font-heading mb-2">AI Recovery Coach</h3>
          <p className="text-sm text-muted max-w-sm mb-6">
            Upgrade to Premium to let our AI analyze your journal entries and urge patterns to give you personalized recovery advice.
          </p>
          <Link 
            href="/dashboard/upgrade"
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-md transition-colors"
          >
            Unlock Premium
          </Link>
        </div>
      )}

      <div className="flex items-center gap-3 mb-6">
        <div className="bg-indigo-500/20 p-2 rounded-xl text-indigo-500">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold font-heading text-indigo-500">StopGoon AI Coach</h2>
          <p className="text-xs text-muted">Powered by your secure recovery data</p>
        </div>
      </div>

      {!hasStarted ? (
        <button 
          onClick={handleGenerate}
          disabled={!isPremium}
          className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-indigo-600/20"
        >
          <Sparkles className="w-4 h-4" />
          Generate Weekly Analysis
        </button>
      ) : (
        <div className="bg-surface/80 border border-border rounded-xl p-5 min-h-[150px]">
          {error ? (
            <p className="text-red-500 text-sm">{error || 'Something went wrong. Please try again later.'}</p>
          ) : (
            <>
              <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                {completion}
              </p>
              {isLoading && (
                <div className="flex items-center gap-2 mt-4 text-indigo-500">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-xs font-medium">Analyzing patterns...</span>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
