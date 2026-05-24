import { emailLayout, button, signature } from './layout'

export function getDay7Email(): { subject: string; html: string } {
  const body = `
    <h1 style="margin:0 0 8px 0;font-size:22px;color:#18181b;font-weight:700;letter-spacing:-0.3px;">
      Willpower is a trap. Do this instead 🛡️
    </h1>
    <p style="margin:0 0 24px 0;font-size:15px;color:#71717a;line-height:1.6;">
      Relying on willpower is why most people relapse. Here is the better way.
    </p>
    <hr style="border:none;border-top:1px solid #e4e4e7;margin:0 0 24px 0;">

    <p style="margin:0 0 16px 0;font-size:15px;color:#52525b;line-height:1.7;">Hey,</p>

    <p style="margin:0 0 16px 0;font-size:15px;color:#52525b;line-height:1.7;">
      Here is a biological truth: <strong style="color:#18181b;">Willpower is a finite resource.</strong>
    </p>

    <p style="margin:0 0 16px 0;font-size:15px;color:#52525b;line-height:1.7;">
      Every decision you make throughout the day—from choosing what to wear to managing stress at work—drains your brain's willpower reservoir. By 10:00 PM, your logic center is completely exhausted.
    </p>

    <p style="margin:0 0 16px 0;font-size:15px;color:#52525b;line-height:1.7;">
      If your strategy is to simply "try harder" when cravings hit late at night, you are setting yourself up for an incredibly exhausting fight.
    </p>

    <p style="margin:0 0 16px 0;font-size:15px;color:#52525b;line-height:1.7;">
      The secret to unbreakable recovery isn't more willpower. It's identifying your triggers and designing your environment.
    </p>

    <p style="margin:0 0 8px 0;font-size:15px;color:#52525b;line-height:1.7;font-weight:600;">If you know exactly when and why your urges hit, you can build proactive defenses:</p>

    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 16px 0;">
      <tr><td style="padding:4px 0;font-size:15px;color:#52525b;line-height:1.7;">→ Is it boredom at 11:00 PM? Place a physical book on your bed and charge your phone in the kitchen.</td></tr>
      <tr><td style="padding:4px 0;font-size:15px;color:#52525b;line-height:1.7;">→ Is it stress after work? Schedule a 10-minute walk or workout immediately after logging off.</td></tr>
    </table>

    <p style="margin:0 0 16px 0;font-size:15px;color:#52525b;line-height:1.7;">
      By tracking your daily check-ins on StopGoon, you are building a personal map of your triggers. Over time, you stop reacting to urges and start predicting them.
    </p>

    <p style="margin:0 0 8px 0;font-size:15px;color:#52525b;line-height:1.7;">
      Stop relying on willpower. Start relying on awareness.
    </p>

    ${button('https://stopgoon.xyz/dashboard', "Log Today's Check-in")}

    ${signature}
  `

  return {
    subject: 'Willpower is a trap. Do this instead 🛡️',
    html: emailLayout(body),
  }
}
