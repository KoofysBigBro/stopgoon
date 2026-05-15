import { createClient } from '@/utils/supabase/server';

const rateMap = new Map<string, { count: number; resetAt: number }>()

export function rateLimit(key: string, limit: number = 10, windowMs: number = 60000): { allowed: boolean; remaining: number } {
  if (typeof globalThis === 'undefined' || process.env.NODE_ENV === 'development') {
    return { allowed: true, remaining: limit }
  }

  const now = Date.now()
  const entry = rateMap.get(key)

  if (!entry || now > entry.resetAt) {
    rateMap.set(key, { count: 1, resetAt: now + windowMs })
    return { allowed: true, remaining: limit - 1 }
  }

  entry.count++
  if (entry.count > limit) {
    return { allowed: false, remaining: 0 }
  }

  return { allowed: true, remaining: limit - entry.count }
}

export async function rateLimitWithDb(key: string, limit: number = 20, windowMs: number = 60000): Promise<{ allowed: boolean; remaining: number }> {
  try {
    const supabase = await createClient()
    const window = Math.floor(Date.now() / windowMs)
    const rateKey = `rate_limit:${key}:${window}`

    const { data: current } = await supabase
      .from('rate_limits')
      .select('count')
      .eq('key', rateKey)
      .single()

    const count = (current?.count || 0) + 1

    if (count === 1) {
      await supabase.from('rate_limits').insert({ key: rateKey, count, expires_at: new Date(Date.now() + windowMs).toISOString() })
    } else {
      await supabase.from('rate_limits').update({ count }).eq('key', rateKey)
    }

    if (count > limit) {
      return { allowed: false, remaining: 0 }
    }

    return { allowed: true, remaining: limit - count }
  } catch {
    return { allowed: true, remaining: limit }
  }
}
