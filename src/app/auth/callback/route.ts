import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { triggerOnboardingEmails } from '@/utils/onboarding-email'
import type { EmailOtpType } from '@supabase/supabase-js'

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
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase
          .from('users')
          .select('onboarding_completed')
          .eq('id', user.id)
          .single()
        if (profile && !profile.onboarding_completed) {
          await triggerOnboardingEmails(user.id)
          next = '/onboarding'
        }
      }
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: type as EmailOtpType,
    })

    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Handle errors
  return NextResponse.redirect(`${origin}/login?error=Could not verify the link`)
}
