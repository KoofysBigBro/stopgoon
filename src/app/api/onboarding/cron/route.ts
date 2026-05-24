import { NextResponse } from 'next/server'
import { createAdminClient } from '@/utils/supabase/admin'
import { logApiError } from '@/utils/api-error'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export const runtime = 'nodejs'
export const maxDuration = 60

export async function GET() {
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
      return NextResponse.json({ sent: 0 })
    }

    let sentCount = 0

    for (const email of pending) {
      try {
        const { error: sendError } = await resend.emails.send({
          from: 'StopGoon <hello@stopgoon.xyz>',
          to: email.to_email,
          subject: email.subject,
          html: email.html_content,
        })

        if (sendError) {
          await supabase
            .from('email_queue')
            .update({ error: sendError.message })
            .eq('id', email.id)

          logApiError('/api/onboarding/cron', sendError, { emailId: email.id })
          continue
        }

        await supabase
          .from('email_queue')
          .update({ sent_at: new Date().toISOString() })
          .eq('id', email.id)

        sentCount++
      } catch (err) {
        logApiError('/api/onboarding/cron', err, { emailId: email.id })
      }
    }

    return NextResponse.json({ sent: sentCount, pending: pending.length })
  } catch (error) {
    logApiError('/api/onboarding/cron', error)
    return NextResponse.json({ error: 'Cron job failed' }, { status: 500 })
  }
}
