import { emailShell } from "@/lib/email/mailer";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function rows(lines: string[]) {
  return lines
    .filter(Boolean)
    .map((line) => `<p style="margin:0 0 8px;font-size:14px;line-height:1.5;">${escapeHtml(line)}</p>`)
    .join("");
}

export function orderCustomerEmail(data: {
  name: string;
  reference: string;
  items: string[];
  subtotalUsd: string;
  localTotal?: string;
  address: string;
}) {
  const body = `
    <p style="margin:0 0 12px;font-size:14px;">Hi ${escapeHtml(data.name)},</p>
    <p style="margin:0 0 12px;font-size:14px;">We received your order request <strong>${escapeHtml(data.reference)}</strong>. A specialist will confirm availability, freight, and payment terms by email.</p>
    ${rows(data.items)}
    <p style="margin:12px 0 0;font-size:14px;"><strong>Subtotal (USD):</strong> ${escapeHtml(data.subtotalUsd)}</p>
    ${data.localTotal ? `<p style="margin:4px 0 0;font-size:13px;color:#475569;">About ${escapeHtml(data.localTotal)} in your local currency.</p>` : ""}
    <p style="margin:12px 0 0;font-size:14px;"><strong>Ship to:</strong> ${escapeHtml(data.address)}</p>
  `;
  return {
    subject: `Order ${data.reference} received · Wonderland Inflatables`,
    html: emailShell("Order request received", body),
    text: `Hi ${data.name},\n\nWe received order ${data.reference}.\n\n${data.items.join("\n")}\nSubtotal (USD): ${data.subtotalUsd}\nShip to: ${data.address}\n`,
  };
}

export function orderStaffEmail(data: {
  reference: string;
  name: string;
  email: string;
  phone: string;
  items: string[];
  subtotalUsd: string;
  address: string;
  notes?: string;
}) {
  const body = `
    ${rows([
      `Reference: ${data.reference}`,
      `Customer: ${data.name}`,
      `Email: ${data.email}`,
      `Phone: ${data.phone}`,
      `Address: ${data.address}`,
      `Subtotal (USD): ${data.subtotalUsd}`,
    ])}
    ${rows(data.items)}
    ${data.notes ? rows([`Notes: ${data.notes}`]) : ""}
  `;
  return {
    subject: `New order ${data.reference} from ${data.name}`,
    html: emailShell("New website order", body),
    text: `New order ${data.reference}\n${data.name} · ${data.email} · ${data.phone}\n${data.items.join("\n")}\n${data.subtotalUsd}\n${data.address}\n`,
  };
}

export function quoteCustomerEmail(data: { name: string; eventType: string }) {
  const body = `
    <p style="margin:0 0 12px;font-size:14px;">Hi ${escapeHtml(data.name)},</p>
    <p style="margin:0;font-size:14px;">Thanks for requesting a quote${data.eventType ? ` for ${escapeHtml(data.eventType)}` : ""}. We typically reply within 2 business hours.</p>
  `;
  return {
    subject: "We received your quote request · Wonderland Inflatables",
    html: emailShell("Quote request received", body),
    text: `Hi ${data.name},\n\nWe received your quote request and will reply within 2 business hours.\n`,
  };
}

export function quoteStaffEmail(data: {
  name: string;
  email: string;
  phone: string;
  eventType: string;
  city: string;
  message: string;
  products: string[];
}) {
  const body = rows([
    `Customer: ${data.name}`,
    `Email: ${data.email}`,
    `Phone: ${data.phone}`,
    `Type: ${data.eventType}`,
    `Location: ${data.city}`,
    ...data.products,
    `Message: ${data.message}`,
  ]);
  return {
    subject: `New quote request from ${data.name}`,
    html: emailShell("New quote request", body),
    text: `${data.name} · ${data.email} · ${data.phone}\n${data.eventType}\n${data.message}\n`,
  };
}

export function contactCustomerEmail(data: { name: string }) {
  const body = `
    <p style="margin:0 0 12px;font-size:14px;">Hi ${escapeHtml(data.name)},</p>
    <p style="margin:0;font-size:14px;">Thanks for contacting Wonderland Inflatables. We will get back to you within 2 business hours.</p>
  `;
  return {
    subject: "We received your message · Wonderland Inflatables",
    html: emailShell("Message received", body),
    text: `Hi ${data.name},\n\nWe received your message and will reply within 2 business hours.\n`,
  };
}

export function contactStaffEmail(data: {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}) {
  const body = rows([
    `From: ${data.name}`,
    `Email: ${data.email}`,
    data.phone ? `Phone: ${data.phone}` : "",
    data.subject ? `Subject: ${data.subject}` : "",
    `Message: ${data.message}`,
  ]);
  return {
    subject: data.subject ? `Contact: ${data.subject}` : `Contact message from ${data.name}`,
    html: emailShell("New contact message", body),
    text: `${data.name} · ${data.email}\n${data.message}\n`,
  };
}

export function statusCustomerEmail(data: {
  name: string;
  kind: "order" | "quote" | "message";
  status: string;
}) {
  const copy: Record<string, string> = {
    contacted: "Our team has started reviewing your request and will follow up shortly.",
    quoted: "Your quote is ready. Watch your inbox for pricing and next steps, or reply to this email.",
    booked: "Great news: your request is confirmed. We will send delivery and payment details next.",
    declined: "We are not able to fulfill this request as submitted. Reply to this email if you want help with another option.",
    replied: "We have replied to your message. If you do not see it, check spam or reply here.",
    read: "We have seen your message and will follow up if anything else is needed.",
    closed: "We have closed this conversation. Reply if you need anything else.",
  };
  const body = `
    <p style="margin:0 0 12px;font-size:14px;">Hi ${escapeHtml(data.name)},</p>
    <p style="margin:0;font-size:14px;">${copy[data.status] ?? `Your ${data.kind} status is now ${escapeHtml(data.status)}.`}</p>
  `;
  return {
    subject: `Update on your ${data.kind} · Wonderland Inflatables`,
    html: emailShell("Status update", body),
    text: `Hi ${data.name},\n\n${copy[data.status] ?? `Your ${data.kind} status is now ${data.status}.`}\n`,
  };
}
