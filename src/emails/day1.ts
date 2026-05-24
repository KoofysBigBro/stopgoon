import { emailLayout, button, signature } from './layout'

export function getDay1Email(): { subject: string; html: string } {
  const body = `
    <h1 style="margin:0 0 8px 0;font-size:22px;color:#18181b;font-weight:700;letter-spacing:-0.3px;">
      Why we threw "streaks" in the trash 🚫
    </h1>
    <p style="margin:0 0 24px 0;font-size:15px;color:#71717a;line-height:1.6;">
      Traditional streak counters are actively hurting your recovery. Here is the science of why.
    </p>
    <hr style="border:none;border-top:1px solid #e4e4e7;margin:0 0 24px 0;">

    <p style="margin:0 0 16px 0;font-size:15px;color:#52525b;line-height:1.7;">Hey,</p>

    <p style="margin:0 0 16px 0;font-size:15px;color:#52525b;line-height:1.7;">
      Let's talk about a silent enemy in habit recovery: the traditional daily streak counter.
    </p>

    <p style="margin:0 0 16px 0;font-size:15px;color:#52525b;line-height:1.7;">
      You know the cycle. You stay clean for 30 days. You feel great. Then, a stressful night hits, you have a slip, and the app dramatically flashes: STREAK RESET TO ZERO.
    </p>

    <p style="margin:0 0 16px 0;font-size:15px;color:#52525b;line-height:1.7;">
      How does that feel?
    </p>

    <p style="margin:0 0 16px 0;font-size:15px;color:#52525b;line-height:1.7;">
      Usually, it feels like complete failure. You feel like all your progress vanished. And psychologically, your brain says, "Well, since the streak is already broken, I might as well binge today."
    </p>

    <p style="margin:0 0 16px 0;font-size:15px;color:#52525b;line-height:1.7;">
      In psychology, this is called the "What the Hell" effect. And it is exactly why traditional shame-based streaks fail.
    </p>

    <p style="margin:0 0 16px 0;font-size:15px;color:#52525b;line-height:1.7;">
      At StopGoon, we do things differently. We track <strong style="color:#18181b;">Days of Growth</strong>.
    </p>

    <p style="margin:0 0 16px 0;font-size:15px;color:#52525b;line-height:1.7;">
      If you go 30 days clean, slip once, and then go 10 days clean, your progress is 40 Days of Growth — not 10.
    </p>

    <p style="margin:0 0 16px 0;font-size:15px;color:#52525b;line-height:1.7;">
      Your brain didn't magically unlearn 30 days of neural rewiring overnight because of one setback. You didn't lose your progress. You just added a data point.
    </p>

    <p style="margin:0 0 8px 0;font-size:15px;color:#52525b;line-height:1.7;">
      Today, focus on building growth, not keeping a fragile record.
    </p>

    ${button('https://stopgoon.xyz/dashboard', 'Log Your Growth Today')}

    ${signature}
  `

  return {
    subject: 'Why we threw "streaks" in the trash 🚫',
    html: emailLayout(body),
  }
}
