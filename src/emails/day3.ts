import { emailLayout, button, signature } from './layout'

export function getDay3Email(): { subject: string; html: string } {
  const body = `
    <h1 style="margin:0 0 8px 0;font-size:22px;color:#18181b;font-weight:700;letter-spacing:-0.3px;">
      How to "surf" a craving 🌊
    </h1>
    <p style="margin:0 0 24px 0;font-size:15px;color:#71717a;line-height:1.6;">
      Don't fight the urge. Learn the clinically-proven trick to ride it out instead.
    </p>
    <hr style="border:none;border-top:1px solid #e4e4e7;margin:0 0 24px 0;">

    <p style="margin:0 0 16px 0;font-size:15px;color:#52525b;line-height:1.7;">Hey,</p>

    <p style="margin:0 0 16px 0;font-size:15px;color:#52525b;line-height:1.7;">
      When a intense urge hits, what do you usually do?
    </p>

    <p style="margin:0 0 16px 0;font-size:15px;color:#52525b;line-height:1.7;">
      Most people try to fight it with raw willpower. They clench their fists, grit their teeth, and try to force the thought away.
    </p>

    <p style="margin:0 0 16px 0;font-size:15px;color:#52525b;line-height:1.7;">
      But trying to force an urge out is like trying to hold a beachball underwater. The harder you push, the more violently it pops back up.
    </p>

    <p style="margin:0 0 16px 0;font-size:15px;color:#52525b;line-height:1.7;">
      Instead of fighting it, we want to teach you how to <strong style="color:#18181b;">Surf the Urge</strong>.
    </p>

    <p style="margin:0 0 16px 0;font-size:15px;color:#52525b;line-height:1.7;">
      Cravings are like ocean waves. They start small, build up in intensity to a peak, and then naturally break and dissolve. If you don't feed them with attention or fight them with panic, they rarely last more than 90 to 120 seconds.
    </p>

    <p style="margin:0 0 8px 0;font-size:15px;color:#52525b;line-height:1.7;font-weight:600;">Here is how to surf a craving today:</p>

    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 16px 0;">
      <tr><td style="padding:4px 0;font-size:15px;color:#52525b;line-height:1.7;"><strong style="color:#18181b;">Notice it:</strong> Acknowledge the urge without judging it. Say to yourself, "Okay, I'm feeling an intense urge right now."</td></tr>
      <tr><td style="padding:4px 0;font-size:15px;color:#52525b;line-height:1.7;"><strong style="color:#18181b;">Locate it:</strong> Where is it in your body? Is it a tight chest? A restless feeling in your hands?</td></tr>
      <tr><td style="padding:4px 0;font-size:15px;color:#52525b;line-height:1.7;"><strong style="color:#18181b;">Breathe through it:</strong> Focus entirely on your physical sensations and breathe slowly. Don't fight it. Just watch the wave rise, peak, and recede.</td></tr>
    </table>

    <p style="margin:0 0 16px 0;font-size:15px;color:#52525b;line-height:1.7;font-weight:600;">Need backup?</p>

    <p style="margin:0 0 8px 0;font-size:15px;color:#52525b;line-height:1.7;">
      If the wave feels too big to surf alone, open StopGoon and hit the red SOS button at the bottom of your screen.
    </p>

    <p style="margin:0 0 8px 0;font-size:15px;color:#52525b;line-height:1.7;">
      It instantly launches a 2-minute guided breathing and grounding routine designed to calm your nervous system and break the urge loop.
    </p>

    ${button('https://stopgoon.xyz/dashboard', 'Find the SOS Button Here')}

    <p style="margin:0 0 8px 0;font-size:15px;color:#52525b;line-height:1.7;">You're doing great.</p>

    ${signature}
  `

  return {
    subject: 'How to "surf" a craving 🌊',
    html: emailLayout(body),
  }
}
