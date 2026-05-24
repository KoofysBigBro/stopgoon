import { emailLayout, button, signature } from './layout'

export function getDay14Email(): { subject: string; html: string } {
  const body = `
    <h1 style="margin:0 0 8px 0;font-size:22px;color:#18181b;font-weight:700;letter-spacing:-0.3px;">
      One reframe that makes recovery easy ☕
    </h1>
    <p style="margin:0 0 24px 0;font-size:15px;color:#71717a;line-height:1.6;">
      Is your long-term focus worth less than the price of a coffee?
    </p>
    <hr style="border:none;border-top:1px solid #e4e4e7;margin:0 0 24px 0;">

    <p style="margin:0 0 16px 0;font-size:15px;color:#52525b;line-height:1.7;">Hey,</p>

    <p style="margin:0 0 16px 0;font-size:15px;color:#52525b;line-height:1.7;">
      Two weeks ago, you signed up for StopGoon because you wanted a healthier, more focused, and more disciplined life.
    </p>

    <p style="margin:0 0 16px 0;font-size:15px;color:#52525b;line-height:1.7;">
      You wanted to break the cycles of digital fatigue, brain fog, and compulsive urges.
    </p>

    <p style="margin:0 0 16px 0;font-size:15px;color:#52525b;line-height:1.7;">
      But real, lasting change doesn't happen by accident. It requires committing to a system that supports you when you are tired, stressed, or tempted.
    </p>

    <p style="margin:0 0 16px 0;font-size:15px;color:#52525b;line-height:1.7;">
      <strong style="color:#18181b;">StopGoon Premium</strong> is designed to be that system.
    </p>

    <p style="margin:0 0 16px 0;font-size:15px;color:#52525b;line-height:1.7;">
      At €5.99 a month (or just €4.16 a month on our yearly plan), unlocking absolute privacy, predictive AI risk alerts, and 24/7 coaching costs less than buying one single coffee per week.
    </p>

    <p style="margin:0 0 8px 0;font-size:15px;color:#52525b;line-height:1.7;font-weight:600;">Reframing the investment is simple:</p>

    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 16px 0;">
      <tr><td style="padding:4px 0;font-size:15px;color:#52525b;line-height:1.7;">☕ A cup of coffee gives you a 30-minute artificial dopamine spike.</td></tr>
      <tr><td style="padding:4px 0;font-size:15px;color:#52525b;line-height:1.7;"><strong style="color:#18181b;">StopGoon Premium</strong> gives you a lifetime of re-sensitized dopamine receptors, mental clarity, and unbreakable focus.</td></tr>
    </table>

    <p style="margin:0 0 8px 0;font-size:15px;color:#52525b;line-height:1.7;">
      You are worth far more than the price of a coffee.
    </p>

    <p style="margin:0 0 8px 0;font-size:15px;color:#52525b;line-height:1.7;">
      Take full control of your recovery today. Your future self will thank you.
    </p>

    ${button('https://stopgoon.xyz/pricing', 'Upgrade to StopGoon Premium')}

    <p style="margin:8px 0 0 0;font-size:13px;color:#a1a1aa;line-height:1.5;font-style:italic;">
      Includes our 14-day money-back guarantee. If you don't feel a positive shift, just let us know for a full refund.
    </p>

    ${signature}
  `

  return {
    subject: 'One reframe that makes recovery easy ☕',
    html: emailLayout(body),
  }
}
