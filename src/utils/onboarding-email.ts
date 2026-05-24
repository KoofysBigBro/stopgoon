import { createAdminClient } from './supabase/admin'
import { onboardingEmails } from '@/emails'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function triggerOnboardingEmails(userId: string) {
  const supabase = createAdminClient()

  const { data: user, error: userError } = await supabase
    .from('users')
    .select('email')
    .eq('id', userId)
    .single()

  if (userError || !user) {
    console.error('[onboarding-email] User not found', { userId, userError })
    return
  }

  const existing = await supabase
    .from('email_queue')
    .select('id')
    .eq('user_id', userId)
    .limit(1)

  if (existing.data && existing.data.length > 0) {
    return
  }

  const now = new Date()

  const queueEntries = onboardingEmails.map(email => ({
    user_id: userId,
    email_type: email.type,
    to_email: user.email,
    subject: email.getContent().subject,
    html_content: email.getContent().html,
    scheduled_for: new Date(now.getTime() + email.delayDays * 24 * 60 * 60 * 1000).toISOString(),
  }))

  const { error: insertError } = await supabase
    .from('email_queue')
    .insert(queueEntries)

  if (insertError) {
    console.error('[onboarding-email] Failed to insert queue', insertError)
    return
  }

  const welcomeContent = onboardingEmails[0].getContent()
  const { error: sendError } = await resend.emails.send({
    from: 'StopGoon <hello@stopgoon.xyz>',
    to: user.email,
    subject: welcomeContent.subject,
    html: welcomeContent.html,
  })

  if (sendError) {
    await supabase
      .from('email_queue')
      .update({ error: sendError.message })
      .eq('user_id', userId)
      .eq('email_type', 'welcome')

    console.error('[onboarding-email] Failed to send welcome email', sendError)
    return
  }

  await supabase
    .from('email_queue')
    .update({ sent_at: new Date().toISOString() })
    .eq('user_id', userId)
    .eq('email_type', 'welcome')
}
