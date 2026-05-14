'use client';

import React, { useState } from 'react';

import { Sparkles, Loader2, Brain } from 'lucide-react';
import PremiumCardOverlay from '@/components/premium/PremiumCardOverlay';

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

  if (!isPremium) {
    return (
      <PremiumCardOverlay
        title="AI Recovery Coach"
        description="Upgrade to Premium to let our AI analyze your journal entries and urge patterns to give you personalized recovery advice."
        feature="Personalized AI Guidance"
        icon={<Brain className="w-7 h-7 text-white" />}
        variant="indigo"
      >
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-indigo-500/20 p-2 rounded-xl text-indigo-500">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-heading text-indigo-500">StopGoon AI Coach</h2>
              <p className="text-xs text-muted">Powered by your secure recovery data</p>
            </div>
          </div>
          <div className="w-full py-4 bg-indigo-600/50 text-white rounded-xl font-bold text-center">
            <Sparkles className="w-4 h-4 inline mr-2" />
            Generate Weekly Analysis
          </div>
        </div>
      </PremiumCardOverlay>
    );
  }

  return (
    <div className="bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-transparent border border-indigo-500/20 rounded-2xl p-6 shadow-sm relative overflow-hidden min-h-[250px] flex flex-col justify-center">

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
          className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-indigo-600/20 hover:shadow-lg hover:shadow-indigo-600/30 active:scale-[0.98]"
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
