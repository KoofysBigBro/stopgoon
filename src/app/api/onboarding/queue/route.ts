import { NextResponse } from 'next/server'
import { logApiError } from '@/utils/api-error'
import { triggerOnboardingEmails } from '@/utils/onboarding-email'

export async function POST(request: Request) {
  try {
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
    }

    await triggerOnboardingEmails(userId)

    return NextResponse.json({ success: true })
  } catch (error) {
    logApiError('/api/onboarding/queue', error)
    return NextResponse.json({ error: 'Failed to queue onboarding emails' }, { status: 500 })
  }
}
