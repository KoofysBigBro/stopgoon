import { emailLayout, button, signature } from './layout'

export function getDay5Email(): { subject: string; html: string } {
  const body = `
    <h1 style="margin:0 0 8px 0;font-size:22px;color:#18181b;font-weight:700;letter-spacing:-0.3px;">
      Marcus's story (and why a slip isn't a failure) 🏗️
    </h1>
    <p style="margin:0 0 24px 0;font-size:15px;color:#71717a;line-height:1.6;">
      "I relapsed 4 times using other apps…" Here is how Marcus broke the cycle.
    </p>
    <hr style="border:none;border-top:1px solid #e4e4e7;margin:0 0 24px 0;">

    <p style="margin:0 0 16px 0;font-size:15px;color:#52525b;line-height:1.7;">Hey,</p>

    <p style="margin:0 0 16px 0;font-size:15px;color:#52525b;line-height:1.7;">
      Setbacks are a normal part of recovery. Let's normalize that right now.
    </p>

    <p style="margin:0 0 16px 0;font-size:15px;color:#52525b;line-height:1.7;">
      A few months ago, a user named Marcus T. joined StopGoon. He sent us this note recently, and we wanted to share it with you:
    </p>

    <blockquote style="margin:0 0 16px 0;padding:16px 20px;border-left:3px solid #18181b;background-color:#f4f4f5;border-radius:4px;font-size:15px;color:#52525b;line-height:1.7;font-style:italic;">
      "I relapsed 4 times using other apps and always felt like garbage afterward. The shame made me spiral into weeks of binging. With StopGoon, my relapse last month didn't spiral. I logged it, did the breathing reset, and was back on track the next morning. The 'Days of Growth' reframe changed my whole mindset."
    </blockquote>

    <p style="margin:0 0 16px 0;font-size:15px;color:#52525b;line-height:1.7;font-weight:600;">Why did Marcus succeed this time?</p>

    <p style="margin:0 0 16px 0;font-size:15px;color:#52525b;line-height:1.7;">
      Because he stopped treating a slip like a moral failure. He treated it like an intelligence event.
    </p>

    <p style="margin:0 0 16px 0;font-size:15px;color:#52525b;line-height:1.7;">
      When you experience a slip, your brain is giving you highly valuable information. It's telling you exactly where your triggers are, what time of day you are most vulnerable, and where your friction failed.
    </p>

    <p style="margin:0 0 16px 0;font-size:15px;color:#52525b;line-height:1.7;">
      Instead of asking, "How could I be so weak?", Marcus asked, "What can I learn from this trigger to protect myself next time?"
    </p>

    <p style="margin:0 0 8px 0;font-size:15px;color:#52525b;line-height:1.7;">
      If you've had a setback recently, do not hide from it. Log it privately, use the reset, and let's keep building your Days of Growth.
    </p>

    ${button('https://stopgoon.xyz/dashboard', 'Log Your Progress Privately')}

    <p style="margin:0 0 8px 0;font-size:15px;color:#52525b;line-height:1.7;">We're in this together,</p>

    ${signature}
  `

  return {
    subject: "Marcus's story (and why a slip isn't a failure) 🏗️",
    html: emailLayout(body),
  }
}
