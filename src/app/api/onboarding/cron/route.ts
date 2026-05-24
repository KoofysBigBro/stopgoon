import { NextResponse } from 'next/server'
import { createAdminClient } from '@/utils/supabase/admin'
import { logApiError } from '@/utils/api-error'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export const runtime = 'nodejs'
export const maxDuration = 60

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization') || ''
  const expectedToken = process.env.CRON_SECRET
  if (expectedToken && authHeader !== `Bearer ${expectedToken}`) {
    console.warn('[onboarding/cron] Unauthorized attempt', { ip: request.headers.get('x-forwarded-for') })
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const hasResendKey = !!process.env.RESEND_API_KEY
  console.log('[onboarding/cron] Starting run', { hasResendKey, resendKeyPrefix: process.env.RESEND_API_KEY?.substring(0, 8) })

  try {
    const supabase = createAdminClient()

    const now = new Date().toISOString()

    const { data: pending, error: fetchError } = await supabase
      .from('email_queue')
      .select('*')
      .is('sent_at', null)
      .lte('scheduled_for', now)
      .order('scheduled_for', { ascending: true })
      .limit(10)

    if (fetchError) {
      throw fetchError
    }

    if (!pending || pending.length === 0) {
      console.log('[onboarding/cron] No pending emails to send')
      return NextResponse.json({ sent: 0 })
    }

    console.log('[onboarding/cron] Pending emails found', { count: pending.length, emails: pending.map(e => ({ id: e.id, type: e.email_type, to: e.to_email, scheduled: e.scheduled_for })) })

    let sentCount = 0

    for (const email of pending) {
      try {
        console.log('[onboarding/cron] Attempting send', { emailId: email.id, type: email.email_type, to: email.to_email, subject: email.subject })

        const { error: sendError } = await resend.emails.send({
          from: 'StopGoon <hello@stopgoon.xyz>',
          to: email.to_email,
          subject: email.subject,
          html: email.html_content,
        })

        if (sendError) {
          console.error('[onboarding/cron] Resend send error', { emailId: email.id, error: sendError })

          await supabase
            .from('email_queue')
            .update({ error: sendError.message })
            .eq('id', email.id)

          logApiError('/api/onboarding/cron', sendError, { emailId: email.id })
          continue
        }

        console.log('[onboarding/cron] Resend send success', { emailId: email.id, type: email.email_type, to: email.to_email })

        await supabase
          .from('email_queue')
          .update({ sent_at: new Date().toISOString() })
          .eq('id', email.id)

        sentCount++
      } catch (err) {
        console.error('[onboarding/cron] Send threw exception', { emailId: email.id, error: err })
        logApiError('/onboarding/cron', err, { emailId: email.id })
      }
    }

    console.log('[onboarding/cron] Run complete', { sent: sentCount, total: pending.length })
    return NextResponse.json({ sent: sentCount, pending: pending.length })
  } catch (error) {
    console.error('[onboarding/cron] Fatal error', error)
    logApiError('/api/onboarding/cron', error)
    return NextResponse.json({ error: 'Cron job failed' }, { status: 500 })
  }
}
