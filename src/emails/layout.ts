export function emailLayout(body: string): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;">
    <tr>
      <td align="center" style="padding:40px 20px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
          <tr>
            <td align="center" style="padding:0 0 24px 0;">
              <img src="https://stopgoon.xyz/favicon.ico" alt="StopGoon" width="40" height="40" style="display:block;border-radius:10px;">
            </td>
          </tr>
          <tr>
            <td style="background-color:#ffffff;border-radius:12px;padding:40px 32px;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
              ${body}
            </td>
          </tr>
          <tr>
            <td style="padding:24px 0 0 0;text-align:center;">
              <p style="margin:0;font-size:13px;color:#a1a1aa;line-height:1.5;">
                StopGoon &mdash; Rebuild your relationship with yourself, one day at a time.
              </p>
              <p style="margin:8px 0 0 0;font-size:12px;color:#a1a1aa;line-height:1.5;">
                If you no longer wish to receive these emails, you can <a href="{{unsubscribe_url}}" style="color:#a1a1aa;text-decoration:underline;">unsubscribe</a>.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

export function button(href: string, text: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px auto;">
    <tr>
      <td align="center" style="background-color:#18181b;border-radius:8px;padding:0;">
        <a href="${href}" style="display:inline-block;padding:14px 32px;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;letter-spacing:0.3px;">${text}</a>
      </td>
    </tr>
  </table>`
}

export const signature = `
  <p style="margin:24px 0 0 0;font-size:15px;color:#52525b;line-height:1.6;">
    Warmly,<br>
    <strong style="color:#18181b;">The StopGoon Team</strong>
  </p>
`
