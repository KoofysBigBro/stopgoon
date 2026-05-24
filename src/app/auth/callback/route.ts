import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { triggerOnboardingEmails } from '@/utils/onboarding-email'
import type { EmailOtpType } from '@supabase/supabase-js'

async function triggerForNewUser(userId: string) {
  const supabase = await createClient()
  const { data: profile } = await supabase
    .from('users')
    .select('onboarding_completed')
    .eq('id', userId)
    .single()

  if (profile && !profile.onboarding_completed) {
    console.log('[auth/callback] New user detected, queuing onboarding emails', { userId })
    try {
      await triggerOnboardingEmails(userId)
      return '/onboarding'
    } catch (err) {
      console.error('[auth/callback] triggerOnboardingEmails failed', { userId, error: err })
    }
  } else {
    console.log('[auth/callback] Onboarding already completed or profile missing, skipping email trigger', { userId, profile })
  }

  return null
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const tokenHash = searchParams.get('token_hash')
  const type = searchParams.get('type')
  let next = searchParams.get('next') ?? '/dashboard'

  const supabase = await createClient()

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      console.log('[auth/callback] Code exchanged successfully')
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const onboardingPath = await triggerForNewUser(user.id)
        if (onboardingPath) next = onboardingPath
      }
      return NextResponse.redirect(`${origin}${next}`)
    }

    console.error('[auth/callback] exchangeCodeForSession error', { error })
  }

  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: type as EmailOtpType,
    })

    if (!error) {
      console.log('[auth/callback] OTP verified', { type })
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const onboardingPath = await triggerForNewUser(user.id)
        if (onboardingPath) next = onboardingPath
      }
      return NextResponse.redirect(`${origin}${next}`)
    }

    console.error('[auth/callback] verifyOtp error', { error, type })
  }

  console.error('[auth/callback] No valid auth flow found, redirecting to login with error')
  return NextResponse.redirect(`${origin}/login?error=Could not verify the link`)
}
