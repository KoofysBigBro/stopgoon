import { emailLayout, button, signature } from './layout'

export function getWelcomeEmail(): { subject: string; html: string } {
  const body = `
    <h1 style="margin:0 0 8px 0;font-size:22px;color:#18181b;font-weight:700;letter-spacing:-0.3px;">
      Welcome to StopGoon 🤝
    </h1>
    <p style="margin:0 0 24px 0;font-size:15px;color:#71717a;line-height:1.6;">
      Here is your starting point
    </p>
    <hr style="border:none;border-top:1px solid #e4e4e7;margin:0 0 24px 0;">

    <p style="margin:0 0 16px 0;font-size:15px;color:#52525b;line-height:1.7;">Hey there,</p>

    <p style="margin:0 0 16px 0;font-size:15px;color:#52525b;line-height:1.7;">
      First, take a deep breath.
    </p>

    <p style="margin:0 0 16px 0;font-size:15px;color:#52525b;line-height:1.7;">
      Deciding to take control of your habits takes real courage, and we want to acknowledge you for taking this first step. You are here, and that is what matters.
    </p>

    <p style="margin:0 0 16px 0;font-size:15px;color:#52525b;line-height:1.7;">
      StopGoon isn't like other recovery apps. We don't believe in shame, guilt, or robotic streak counters that make you feel like garbage if you slip up.
    </p>

    <p style="margin:0 0 16px 0;font-size:15px;color:#52525b;line-height:1.7;">
      We are here to help you rebuild your relationship with yourself, one day at a time, on your own terms.
    </p>

    <p style="margin:0 0 8px 0;font-size:15px;color:#52525b;line-height:1.7;font-weight:600;">Here is what you can expect from us over the next two weeks:</p>

    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 16px 0;">
      <tr><td style="padding:4px 0;font-size:15px;color:#52525b;line-height:1.7;">✓ Daily, private, 2-minute check-ins to build awareness.</td></tr>
      <tr><td style="padding:4px 0;font-size:15px;color:#52525b;line-height:1.7;">✓ Shame-free tracking that values your overall progress, not just consecutive days.</td></tr>
      <tr><td style="padding:4px 0;font-size:15px;color:#52525b;line-height:1.7;">✓ Guided emergency tools when cravings hit hard.</td></tr>
    </table>

    <p style="margin:0 0 16px 0;font-size:15px;color:#52525b;line-height:1.7;font-weight:600;">Your only task today?</p>

    <p style="margin:0 0 8px 0;font-size:15px;color:#52525b;line-height:1.7;">
      Open the app and complete your very first 2-minute check-in. It's quick, it's completely private, and it sets the foundation for your recovery.
    </p>

    ${button('https://stopgoon.xyz/dashboard', 'Complete Your First Check-In')}

    ${signature}
  `

  return {
    subject: 'Welcome to StopGoon 🤝 Here is your starting point',
    html: emailLayout(body),
  }
}
