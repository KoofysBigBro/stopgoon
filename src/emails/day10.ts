import { emailLayout, button, signature } from './layout'

export function getDay10Email(): { subject: string; html: string } {
  const body = `
    <h1 style="margin:0 0 8px 0;font-size:22px;color:#18181b;font-weight:700;letter-spacing:-0.3px;">
      You've made it 10 days. Let's look ahead 🚀
    </h1>
    <p style="margin:0 0 24px 0;font-size:15px;color:#71717a;line-height:1.6;">
      You're building real momentum. Here is how to unlock your next level of recovery.
    </p>
    <hr style="border:none;border-top:1px solid #e4e4e7;margin:0 0 24px 0;">

    <p style="margin:0 0 16px 0;font-size:15px;color:#52525b;line-height:1.7;">Hey,</p>

    <p style="margin:0 0 16px 0;font-size:15px;color:#52525b;line-height:1.7;">
      Ten days. Think about that.
    </p>

    <p style="margin:0 0 16px 0;font-size:15px;color:#52525b;line-height:1.7;">
      Whether you've had a perfect run or navigated a few slips, you have spent the last 10 days showing up for yourself. That is real, tangible momentum.
    </p>

    <p style="margin:0 0 16px 0;font-size:15px;color:#52525b;line-height:1.7;">
      By now, you've logged enough check-ins to establish baseline habits. But as you enter the next phase, the urges can become more subtle and harder to predict.
    </p>

    <p style="margin:0 0 16px 0;font-size:15px;color:#52525b;line-height:1.7;">
      That is where <strong style="color:#18181b;">StopGoon Premium</strong> comes in.
    </p>

    <p style="margin:0 0 16px 0;font-size:15px;color:#52525b;line-height:1.7;">
      While the free essentials tracker is great for starting, Premium unlocks the active biological shield you need to make recovery permanent:
    </p>

    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 16px 0;">
      <tr><td style="padding:4px 0;font-size:15px;color:#52525b;line-height:1.7;"><strong style="color:#18181b;">AI-Powered Trigger Analysis:</strong> Stop guessing. Our engine automatically analyzes your check-ins to pinpoint your exact high-risk emotional states and context clues.</td></tr>
      <tr><td style="padding:4px 0;font-size:15px;color:#52525b;line-height:1.7;"><strong style="color:#18181b;">Predictive Relapse Warnings:</strong> The system spots patterns in your logs and alerts you before you enter a danger zone, prompts you with a reset, and protects your focus.</td></tr>
      <tr><td style="padding:4px 0;font-size:15px;color:#52525b;line-height:1.7;"><strong style="color:#18181b;">Unlimited AI Coaching (24/7):</strong> A non-judgmental, fully private conversational recovery coach available whenever you need to talk through an urge in real-time.</td></tr>
    </table>

    <p style="margin:0 0 8px 0;font-size:15px;color:#52525b;line-height:1.7;">
      You've built the foundation. Now, let's remove the guesswork and secure your progress.
    </p>

    ${button('https://stopgoon.xyz/pricing', 'Explore StopGoon Premium')}

    ${signature}
  `

  return {
    subject: "You've made it 10 days. Let's look ahead 🚀",
    html: emailLayout(body),
  }
}
