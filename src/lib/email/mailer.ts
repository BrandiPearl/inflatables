import nodemailer from "nodemailer";

import { BUSINESS_EMAIL } from "@/lib/contact-info";

function fromAddress() {
  const user = process.env.SMTP_USER || BUSINESS_EMAIL;
  return process.env.MAIL_FROM || `Wonderland Inflatables <${user}>`;
}

export function staffInbox() {
  return process.env.MAIL_TO || process.env.SMTP_USER || BUSINESS_EMAIL;
}

export function isMailConfigured() {
  return Boolean(process.env.SMTP_USER && process.env.SMTP_PASS);
}

function transporter() {
  const user = process.env.SMTP_USER;
  const pass = (process.env.SMTP_PASS || "").replace(/\s+/g, "");
  if (!user || !pass) return null;
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT || 465),
    secure: Number(process.env.SMTP_PORT || 465) === 465,
    auth: { user, pass },
  });
}

export async function sendMail(options: {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
}) {
  const transport = transporter();
  if (!transport) {
    console.warn("Email skipped: SMTP_USER / SMTP_PASS are not set.");
    return { sent: false };
  }

  try {
    await transport.sendMail({
      from: fromAddress(),
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
      replyTo: options.replyTo,
    });
    return { sent: true };
  } catch (error) {
    console.error("sendMail:", error);
    return { sent: false };
  }
}

export function emailShell(title: string, bodyHtml: string) {
  return `<!doctype html>
<html>
<body style="margin:0;padding:0;background:#f8fafc;font-family:Arial,sans-serif;color:#0f172a;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e2e8f0;">
          <tr>
            <td style="background:#ea580c;padding:18px 24px;color:#ffffff;font-size:18px;font-weight:700;">
              Wonderland Inflatables
            </td>
          </tr>
          <tr>
            <td style="padding:24px;">
              <h1 style="margin:0 0 16px;font-size:20px;">${title}</h1>
              ${bodyHtml}
              <p style="margin:24px 0 0;font-size:13px;color:#64748b;">
                Wonderland Inflatables · ${BUSINESS_EMAIL}
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
