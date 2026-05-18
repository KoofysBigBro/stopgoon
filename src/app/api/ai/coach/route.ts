import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import { createClient } from '@/utils/supabase/server';
import { rateLimit } from '@/utils/rate-limit';
import { getClientIp } from '@/utils/request';
import { logApiError } from '@/utils/api-error';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req)
    const { allowed } = rateLimit(`ai-coach:${ip}`, 20, 60000)
    if (!allowed) {
      return new Response('Too Many Requests', { status: 429, headers: { 'Retry-After': '60', 'X-RateLimit-Remaining': '0' } })
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return new Response('Unauthorized', { status: 401, headers: { 'Content-Type': 'text/plain' } });
    }

    const perUserRate = rateLimit(`ai-coach:user:${user.id}`, 15, 60000);
    if (!perUserRate.allowed) {
      return new Response('Too Many Requests', { status: 429, headers: { 'Retry-After': '60', 'X-RateLimit-Remaining': '0' } });
    }

    // Check if user is premium
    const { data: profile } = await supabase
      .from('users')
      .select('subscription_tier')
      .eq('id', user.id)
      .single();

    if (profile?.subscription_tier !== 'premium') {
      return new Response('Premium Required', { status: 403, headers: { 'Content-Type': 'text/plain' } });
    }

    // Fetch user's recent data for the AI to analyze
    const { data: journals } = await supabase
      .from('journal_entries')
      .select('content, mood, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5);

    const { data: urges } = await supabase
      .from('urge_logs')
      .select('intensity, triggers, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5);

    const { prompt } = await req.json();
    if (typeof prompt !== 'undefined' && typeof prompt !== 'string') {
      return new Response('Invalid prompt', { status: 400, headers: { 'Content-Type': 'text/plain' } });
    }

    // Construct the context for the AI
    const systemPrompt = `
      You are an empathetic, thoughtful, and professional recovery coach for the "StopGoon" app.
      Your user is trying to overcome an addiction. Be supportive, completely non-judgmental, and practical.
      DO NOT diagnose them or act like a medical doctor. Be a wellness assistant.
      
      Here is their recent data to help you personalize your advice:
      Recent Journal Entries: ${JSON.stringify(journals)}
      Recent Urges/Triggers: ${JSON.stringify(urges)}

      Analyze this data quietly, and respond to the user's prompt by referencing patterns you see (e.g., "I noticed your urges happen a lot when you feel lonely..."). Keep your response concise, warm, and actionable. Max 2 paragraphs.
    `;

    const { text } = await generateText({
      model: google('gemini-2.5-flash'),
      system: systemPrompt,
      prompt: prompt || 'Can you analyze my recent entries and give me some advice?',
    });

    return Response.json({ text });
  } catch (error) {
    logApiError('/api/ai/coach', error);
    return new Response('Internal Server Error', { status: 500, headers: { 'Content-Type': 'text/plain' } });
  }
}
