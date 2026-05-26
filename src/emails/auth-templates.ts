function baseHtml(bodyContent: string): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="dark light">
  <meta name="supported-color-schemes" content="dark light">
  <title>StopGoon</title>
  <style>
    @media (prefers-color-scheme: dark) {
      .email-body { background-color: #18181b !important; }
      .email-card { background-color: #27272a !important; }
    }
    @media (prefers-color-scheme: light) {
      .email-body { background-color: #18181b !important; }
      .email-card { background-color: #27272a !important; }
    }
    @media screen and (max-width: 480px) {
      .email-container { max-width: 100% !important; width: 100% !important; }
      .email-card { padding: 24px 20px !important; }
      .email-padding { padding: 24px 16px !important; }
      .email-button { padding: 14px 20px !important; font-size: 15px !important; }
      .logo-text { font-size: 26px !important; }
    }
  </style>
</head>
<body class="email-body" style="margin:0;padding:0;background-color:#18181b;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif; -webkit-font-smoothing: antialiased;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#18181b;" bgcolor="#18181b">
    <tr>
      <td align="center" class="email-padding" style="padding:40px 20px;">
        <table role="presentation" class="email-container" cellpadding="0" cellspacing="0" style="max-width:480px;width:100%;">

          <!-- Logo -->
          <tr>
            <td align="center" style="padding:0 0 6px 0;">
              <span class="logo-text" style="font-size:28px;font-weight:900;color:#fafafa;letter-spacing:-0.5px;line-height:1.2;">StopGoon</span>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:0 0 4px 0;">
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto;">
                <tr>
                  <td style="width:40px;height:3px;background-color:#6366f1;border-radius:2px;"></td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:0 0 28px 0;">
              <span style="font-size:13px;color:#71717a;letter-spacing:0.2px;">Private recovery. No shame.</span>
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td class="email-card" style="background-color:#27272a;border-radius:12px;padding:36px 28px;border:1px solid #3f3f46;" bgcolor="#27272a">
              ${bodyContent}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:28px 0 0 0;">
              <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;">
                <tr>
                  <td style="padding:0 0 16px 0;">
                    <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;">
                      <tr>
                        <td style="height:1px;background-color:#3f3f46;line-height:1px;font-size:1px;">&nbsp;</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding:0 0 4px 0;">
                    <p style="margin:0;font-size:12px;color:#71717a;line-height:1.5;">
                      You received this because you have an account at StopGoon.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td align="center">
                    <p style="margin:0;font-size:12px;color:#52525b;line-height:1.5;">
                      If you didn't request this, ignore this email.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

function heading(title: string, subtitle: string): string {
  return `
    <h1 style="margin:0 0 4px 0;font-size:20px;color:#fafafa;font-weight:800;letter-spacing:-0.3px;line-height:1.3;">
      ${title}
    </h1>
    <p style="margin:0 0 24px 0;font-size:13px;color:#71717a;line-height:1.5;">
      ${subtitle}
    </p>
    <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;margin:0 0 24px 0;">
      <tr>
        <td style="height:1px;background-color:#3f3f46;line-height:1px;font-size:1px;">&nbsp;</td>
      </tr>
    </table>`
}

function fullButton(href: string, text: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;margin:24px 0 20px 0;">
    <tr>
      <td align="center" style="background-color:#6366f1;border-radius:8px;" bgcolor="#6366f1">
        <a href="${href}" class="email-button" style="display:block;padding:16px 24px;font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;text-align:center;letter-spacing:0.2px;">${text}</a>
      </td>
    </tr>
  </table>`
}

function otpBlock(otp: string): string {
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;margin:20px 0;">
      <tr>
        <td align="center" style="background-color:#18181b;border-radius:8px;padding:14px 20px;border:1px solid #3f3f46;" bgcolor="#18181b">
          <span style="font-family:'Courier New',Courier,monospace;font-size:28px;font-weight:700;color:#fafafa;letter-spacing:6px;">${otp}</span>
        </td>
      </tr>
    </table>`
}

function securityNotice(): string {
  return `
    <p style="margin:0 0 24px 0;font-size:12px;color:#71717a;line-height:1.5;text-align:center;">
      🔒 This link expires in 24 hours. Never share it with anyone.
    </p>`
}

function fallbackLink(url: string): string {
  return `
    <p style="margin:16px 0 0 0;font-size:12px;color:#52525b;line-height:1.5;text-align:center;word-break:break-all;">
      Button not working? <a href="${url}" style="color:#818cf8;text-decoration:underline;">${url}</a>
    </p>`
}

const bodyText = (text: string): string =>
  `<p style="margin:0 0 14px 0;font-size:15px;color:#d4d4d8;line-height:1.7;">${text}</p>`

const greeting = (name: string): string =>
  `<p style="margin:0 0 16px 0;font-size:15px;color:#a1a1aa;line-height:1.7;">${name},</p>`

// ─── 1. Confirm Signup ───────────────────────────────────────────────

export function getConfirmSignupEmail(): { subject: string; html: string } {
  const body = `
    ${heading('Confirm your email', 'One last step and you\'re in.')}

    ${greeting('Hey')}

    ${bodyText('Thanks for signing up for StopGoon. You\'re one click away from taking the first step toward rebuilding your relationship with yourself.')}

    ${bodyText('Click the button below to confirm your email address and activate your account. It only takes a second.')}

    ${fullButton('{{ .ConfirmationURL }}', 'Confirm Email Address')}

    ${securityNotice()}

    ${fallbackLink('{{ .ConfirmationURL }}')}
  `

  return {
    subject: 'Confirm your email — StopGoon',
    html: baseHtml(body),
  }
}

// ─── 2. Invite User ──────────────────────────────────────────────────

export function getInviteEmail(): { subject: string; html: string } {
  const body = `
    ${heading('You\'re invited', 'Someone thinks StopGoon could help you.')}

    ${greeting('Hi')}

    ${bodyText('You\'ve been invited to join StopGoon — a private, shame-free space designed to help you break compulsive habits and build a healthier relationship with yourself.')}

    ${bodyText('No streak shaming. No judgment. Just real tools that work with your brain, not against it.')}

    ${fullButton('{{ .ConfirmationURL }}', 'Accept Invitation')}

    ${securityNotice()}

    ${fallbackLink('{{ .ConfirmationURL }}')}
  `

  return {
    subject: "You're invited to StopGoon",
    html: baseHtml(body),
  }
}

// ─── 3. Magic Link / OTP ─────────────────────────────────────────────

export function getMagicLinkEmail(): { subject: string; html: string } {
  const body = `
    ${heading('Your sign-in link', 'Here\'s your instant access link.')}

    ${greeting('Hey')}

    ${bodyText('Click the button below to sign in to your StopGoon account instantly. No password needed.')}

    ${fullButton('{{ .ConfirmationURL }}', 'Sign In to StopGoon')}

    ${securityNotice()}

    <p style="margin:0 0 8px 0;font-size:14px;color:#a1a1aa;line-height:1.6;text-align:center;">Or enter this one-time code:</p>

    ${otpBlock('{{ .Token }}')}

    <p style="margin:0 0 24px 0;font-size:12px;color:#52525b;line-height:1.5;text-align:center;">This code expires in 10 minutes.</p>

    ${fallbackLink('{{ .ConfirmationURL }}')}
  `

  return {
    subject: 'Sign in to StopGoon',
    html: baseHtml(body),
  }
}

// ─── 4. Change Email Address ─────────────────────────────────────────

export function getChangeEmailEmail(): { subject: string; html: string } {
  const body = `
    ${heading('Confirm your new email', 'You requested an email change.')}

    ${greeting('Hey')}

    ${bodyText('We received a request to change the email address on your StopGoon account to <strong style="color:#fafafa;">{{ .NewEmail }}</strong>.')}

    ${bodyText('Click the button below to confirm this change. If you didn\'t make this request, you can safely ignore this email — your existing address will remain active.')}

    ${fullButton('{{ .ConfirmationURL }}', 'Confirm Email Change')}

    ${securityNotice()}

    ${fallbackLink('{{ .ConfirmationURL }}')}
  `

  return {
    subject: 'Confirm your new email — StopGoon',
    html: baseHtml(body),
  }
}

// ─── 5. Reset Password ───────────────────────────────────────────────

export function getResetPasswordEmail(): { subject: string; html: string } {
  const body = `
    ${heading('Reset your password', 'No worries, it happens to everyone.')}

    ${greeting('Hey')}

    ${bodyText('We\'ve all been there. Click the button below to reset your StopGoon password and get back to your recovery journey.')}

    ${fullButton('{{ .ConfirmationURL }}', 'Reset Password')}

    ${securityNotice()}

    <p style="margin:0 0 4px 0;font-size:12px;color:#52525b;line-height:1.5;text-align:center;">Didn't request this? Your password won't change unless you click the link above.</p>

    ${fallbackLink('{{ .ConfirmationURL }}')}
  `

  return {
    subject: 'Reset your password — StopGoon',
    html: baseHtml(body),
  }
}

// ─── 6. Reauthentication ─────────────────────────────────────────────

export function getReauthenticationEmail(): { subject: string; html: string } {
  const body = `
    ${heading('Confirm it\'s you', 'A quick security check.')}

    ${greeting('Hey')}

    ${bodyText('For security purposes, we need to verify your identity before proceeding with this action.')}

    ${bodyText('Enter the one-time code below to confirm it\'s really you.')}

    ${otpBlock('{{ .Token }}')}

    <p style="margin:0 0 4px 0;font-size:12px;color:#71717a;line-height:1.5;text-align:center;">This code expires in 10 minutes.</p>

    ${securityNotice()}

    <p style="margin:24px 0 0 0;font-size:12px;color:#52525b;line-height:1.5;text-align:center;">If you didn't request this, someone may have your password — change it immediately.</p>
  `

  return {
    subject: 'Confirm it\'s you — StopGoon',
    html: baseHtml(body),
  }
}
