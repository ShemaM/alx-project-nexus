/**
 * Resend email client + branded HTML template helpers.
 *
 * Usage:
 *   import { sendWelcomeEmail, sendVerificationEmail, sendPasswordResetEmail } from '@/lib/email'
 *
 * Required env var:
 *   RESEND_API_KEY — obtain at https://resend.com
 *   NEXT_PUBLIC_APP_URL — e.g. https://bynk.org (used for links in emails)
 */

const RESEND_API_URL = 'https://api.resend.com/emails'
const FROM = 'Banyamulenge Youth Kenya <noreply@bynk.org>'
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000'

// ─── Resend HTTP helper ────────────────────────────────────────────────────

async function send(payload: {
  from: string
  to: string
  subject: string
  html: string
  text?: string
}) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.warn('[email] RESEND_API_KEY not set — email not sent')
    return { ok: false, error: 'RESEND_API_KEY not configured' }
  }

  const res = await fetch(RESEND_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const err = await res.text()
    console.error('[email] Resend error:', err)
    return { ok: false, error: err }
  }

  return { ok: true }
}

// ─── Shared template wrapper ────────────────────────────────────────────────

function baseTemplate(content: string, preheader = '') {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Banyamulenge Youth Kenya</title>
  ${preheader ? `<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">${preheader}</div>` : ''}
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#f1f5f9;">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background:#061027;border-radius:16px 16px 0 0;padding:28px 36px;">
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td>
                    <span style="font-size:18px;font-weight:900;color:#2D8FDD;letter-spacing:-0.5px;">BANYAMULENGE</span>
                    <span style="font-size:10px;font-weight:700;color:#F5D300;letter-spacing:3px;display:block;margin-top:2px;">YOUTH KENYA</span>
                  </td>
                  <td align="right">
                    <span style="font-size:11px;font-weight:700;color:#94a3b8;letter-spacing:2px;text-transform:uppercase;">BYN-K Platform</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background:#ffffff;padding:40px 36px;border-left:1px solid #e2e8f0;border-right:1px solid #e2e8f0;">
              ${content}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f8fafc;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 16px 16px;padding:24px 36px;text-align:center;">
              <p style="margin:0 0 8px;font-size:12px;color:#94a3b8;">
                You received this email because you signed up at
                <a href="${APP_URL}" style="color:#2D8FDD;text-decoration:none;"> bynk.org</a>.
              </p>
              <p style="margin:0;font-size:12px;color:#cbd5e1;">
                &copy; ${new Date().getFullYear()} Banyamulenge Youth Kenya · Nairobi, Kenya
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

function primaryButton(text: string, href: string) {
  return `<a href="${href}" style="display:inline-block;background:linear-gradient(180deg,#ffe95c,#F5D300);color:#061027;font-size:15px;font-weight:800;text-decoration:none;padding:14px 32px;border-radius:10px;border:1px solid rgba(245,211,0,0.6);">${text}</a>`
}

// ─── Welcome email ──────────────────────────────────────────────────────────

export async function sendWelcomeEmail(opts: {
  to: string
  name: string
  verificationUrl: string
}) {
  const { to, name, verificationUrl } = opts
  const firstName = (name || 'there').trim().split(' ')[0]

  const html = baseTemplate(
    `<h1 style="margin:0 0 8px;font-size:28px;font-weight:900;color:#0f172a;">Welcome, ${firstName}! 🎉</h1>
    <p style="margin:0 0 24px;font-size:15px;line-height:1.8;color:#475569;">
      Your BYN-K account is ready. We connect Banyamulenge refugee youth in Kenya with
      verified jobs, scholarships, internships, fellowships, and training programs —
      all filtered by the documents you already have.
    </p>

    <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:24px;margin:0 0 28px;">
      <p style="margin:0 0 12px;font-size:13px;font-weight:800;color:#64748b;letter-spacing:1.5px;text-transform:uppercase;">Verify your email to unlock</p>
      <ul style="margin:0;padding-left:20px;font-size:14px;color:#334155;line-height:2;">
        <li>Save &amp; bookmark opportunities</li>
        <li>Set up personalised email alerts</li>
        <li>Track your application activity</li>
      </ul>
    </div>

    <p style="margin:0 0 24px;font-size:14px;color:#64748b;">
      Click the button below to verify your email. This link expires in <strong>24 hours</strong>.
    </p>

    <div style="text-align:center;margin:0 0 28px;">
      ${primaryButton('Verify My Email', verificationUrl)}
    </div>

    <p style="margin:0;font-size:13px;color:#94a3b8;">
      If the button doesn't work, paste this link into your browser:<br />
      <a href="${verificationUrl}" style="color:#2D8FDD;word-break:break-all;">${verificationUrl}</a>
    </p>`,
    `Welcome to BYN-K, ${firstName}! Verify your email to get started.`,
  )

  return send({ from: FROM, to, subject: `Welcome to BYN-K, ${firstName}! Verify your email`, html })
}

// ─── Verification-only email ────────────────────────────────────────────────

export async function sendVerificationEmail(opts: {
  to: string
  name: string
  verificationUrl: string
}) {
  const { to, name, verificationUrl } = opts
  const firstName = (name || 'there').trim().split(' ')[0]

  const html = baseTemplate(
    `<h1 style="margin:0 0 8px;font-size:26px;font-weight:900;color:#0f172a;">Verify your email address</h1>
    <p style="margin:0 0 24px;font-size:15px;line-height:1.8;color:#475569;">
      Hi ${firstName}, please confirm your email address to activate your BYN-K account.
      This link expires in <strong>24 hours</strong>.
    </p>

    <div style="text-align:center;margin:0 0 28px;">
      ${primaryButton('Verify Email Address', verificationUrl)}
    </div>

    <p style="margin:0;font-size:13px;color:#94a3b8;">
      If you didn't create a BYN-K account, you can safely ignore this email.<br /><br />
      Or paste this link into your browser:<br />
      <a href="${verificationUrl}" style="color:#2D8FDD;word-break:break-all;">${verificationUrl}</a>
    </p>`,
    'Verify your BYN-K email address.',
  )

  return send({ from: FROM, to, subject: 'Verify your BYN-K email address', html })
}

// ─── Password reset email ───────────────────────────────────────────────────

export async function sendPasswordResetEmail(opts: {
  to: string
  name: string
  resetUrl: string
}) {
  const { to, name, resetUrl } = opts
  const firstName = (name || 'there').trim().split(' ')[0]

  const html = baseTemplate(
    `<h1 style="margin:0 0 8px;font-size:26px;font-weight:900;color:#0f172a;">Reset your password</h1>
    <p style="margin:0 0 24px;font-size:15px;line-height:1.8;color:#475569;">
      Hi ${firstName}, we received a request to reset your BYN-K password.
      Click the button below to choose a new one. This link expires in <strong>1 hour</strong>.
    </p>

    <div style="text-align:center;margin:0 0 28px;">
      ${primaryButton('Reset My Password', resetUrl)}
    </div>

    <div style="background:#fff7ed;border:1px solid #fed7aa;border-radius:10px;padding:16px;margin:0 0 24px;">
      <p style="margin:0;font-size:13px;color:#92400e;">
        <strong>Didn't request this?</strong> You can safely ignore this email — your password
        will not change unless you click the link above.
      </p>
    </div>

    <p style="margin:0;font-size:13px;color:#94a3b8;">
      Or paste this link into your browser:<br />
      <a href="${resetUrl}" style="color:#2D8FDD;word-break:break-all;">${resetUrl}</a>
    </p>`,
    'Reset your BYN-K password.',
  )

  return send({ from: FROM, to, subject: 'Reset your BYN-K password', html })
}

// ─── Opportunity digest email ───────────────────────────────────────────────

export async function sendOpportunityDigestEmail(opts: {
  to: string
  name: string
  opportunities: Array<{ title: string; org: string; category: string; url: string; deadline?: string }>
}) {
  const { to, name, opportunities } = opts
  const firstName = (name || 'there').trim().split(' ')[0]

  const cards = opportunities
    .slice(0, 5)
    .map(
      (opp) => `
    <tr>
      <td style="padding:16px;border-bottom:1px solid #f1f5f9;">
        <span style="display:inline-block;background:#eff6ff;color:#1d4ed8;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;padding:3px 10px;border-radius:100px;margin-bottom:6px;">${opp.category}</span>
        <p style="margin:0 0 4px;font-size:15px;font-weight:800;color:#0f172a;">
          <a href="${APP_URL}${opp.url}" style="color:#0f172a;text-decoration:none;">${opp.title}</a>
        </p>
        <p style="margin:0;font-size:13px;color:#64748b;">${opp.org}${opp.deadline ? ` · Deadline: ${opp.deadline}` : ''}</p>
      </td>
    </tr>`,
    )
    .join('')

  const html = baseTemplate(
    `<h1 style="margin:0 0 6px;font-size:24px;font-weight:900;color:#0f172a;">New opportunities for you, ${firstName}</h1>
    <p style="margin:0 0 24px;font-size:14px;color:#64748b;">Here are the latest verified listings matching your interests.</p>

    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;margin:0 0 24px;">
      ${cards}
    </table>

    <div style="text-align:center;margin:0 0 24px;">
      ${primaryButton('Browse all opportunities', `${APP_URL}/opportunities`)}
    </div>

    <p style="margin:0;font-size:12px;color:#94a3b8;text-align:center;">
      <a href="${APP_URL}/unsubscribe" style="color:#94a3b8;">Unsubscribe from alerts</a>
    </p>`,
    `${opportunities.length} new opportunities matched your alerts.`,
  )

  return send({ from: FROM, to, subject: `${opportunities.length} new opportunities matched your alerts`, html })
}
