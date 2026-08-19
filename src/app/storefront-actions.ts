"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { CartOrderInput, QuoteFormInput } from "@/lib/queries/quote";
import { sendMail, staffInbox, isMailConfigured } from "@/lib/email/mailer";
import {
  contactCustomerEmail,
  contactStaffEmail,
  orderCustomerEmail,
  orderStaffEmail,
  quoteCustomerEmail,
  quoteStaffEmail,
} from "@/lib/email/templates";
import { BUSINESS_EMAIL } from "@/lib/contact-info";

function usd(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(amount);
}

function mailNotReady() {
  return {
    success: false,
    error: `Email is not sending right now. Write to ${BUSINESS_EMAIL} and we will help you directly.`,
  };
}

async function sendPair(
  customer: { to: string; subject: string; html: string; text: string },
  staff: { to: string; subject: string; html: string; text: string; replyTo?: string }
) {
  if (!isMailConfigured()) return mailNotReady();
  const results = await Promise.all([sendMail(customer), sendMail(staff)]);
  if (results.every((result) => !result.sent)) return mailNotReady();
  return { success: true as const };
}

async function db() {
  const admin = createAdminClient();
  if (admin) return admin;
  if (!isSupabaseConfigured()) return null;
  const { createClient } = await import("@/lib/supabase/server");
  return createClient();
}

export async function submitCartOrder(
  data: CartOrderInput
): Promise<{ success: boolean; error?: string; reference?: string }> {
  if (!isMailConfigured()) return mailNotReady();
  const lines = data.items.map(
    (item) => `${item.qty} x ${item.sku} ${item.name} ($${item.price.toLocaleString("en-US")})`
  );
  const subtotal = data.items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const message = [
    `Order ${data.reference}`,
    data.company ? `Company: ${data.company}` : "",
    "",
    "Items:",
    ...lines,
    "",
    `Subtotal: $${subtotal.toLocaleString("en-US")}`,
    data.local_total ? `Local estimate: ${data.local_total}` : "",
    data.notes ? `\nNotes:\n${data.notes}` : "",
  ]
    .filter((line) => line !== "")
    .join("\n");

  const client = await db();
  if (client) {
    const { error } = await client.from("quote_requests").insert({
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      phone: data.phone,
      event_type: "Purchase",
      event_address: data.address || null,
      city: data.city,
      state: data.state,
      zip: data.zip,
      guests_count: String(data.items.reduce((sum, item) => sum + item.qty, 0)),
      products_interested: lines,
      budget: String(subtotal),
      message,
      how_did_you_hear: data.how_did_you_hear || null,
      status: "pending",
    });
    if (error) return { success: false, error: error.message };
  }

  const name = `${data.first_name} ${data.last_name}`.trim();
  const address = [data.address, data.city, data.state, data.zip].filter(Boolean).join(", ");
  const customer = orderCustomerEmail({
    name: data.first_name,
    reference: data.reference,
    items: lines,
    subtotalUsd: usd(subtotal),
    localTotal: data.local_total,
    address,
  });
  const staff = orderStaffEmail({
    reference: data.reference,
    name,
    email: data.email,
    phone: data.phone,
    items: lines,
    subtotalUsd: usd(subtotal),
    address,
    notes: data.notes,
  });

  const mailed = await sendPair(
    { to: data.email, ...customer },
    { to: staffInbox(), ...staff, replyTo: data.email }
  );
  if (!mailed.success) return mailed;

  return { success: true, reference: data.reference };
}

export async function submitQuoteRequest(
  data: QuoteFormInput
): Promise<{ success: boolean; error?: string }> {
  if (!isMailConfigured()) return mailNotReady();
  const client = await db();
  if (client) {
    const { error } = await client.from("quote_requests").insert({
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      phone: data.phone,
      event_date: data.event_date || null,
      event_type: data.event_type,
      city: data.city,
      state: data.state,
      zip: data.zip,
      guests_count: data.guests_count,
      products_interested: data.products_interested ?? [],
      message: data.message,
      how_did_you_hear: data.how_did_you_hear || null,
      status: "pending",
    });
    if (error) return { success: false, error: error.message };
  }

  const name = `${data.first_name} ${data.last_name}`.trim();
  const customer = quoteCustomerEmail({ name: data.first_name, eventType: data.event_type });
  const staff = quoteStaffEmail({
    name,
    email: data.email,
    phone: data.phone,
    eventType: data.event_type,
    city: [data.city, data.state].filter(Boolean).join(", "),
    message: data.message,
    products: data.products_interested ?? [],
  });

  const mailed = await sendPair(
    { to: data.email, ...customer },
    { to: staffInbox(), ...staff, replyTo: data.email }
  );
  if (!mailed.success) return mailed;

  return { success: true };
}

export async function submitContactMessage(data: {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}): Promise<{ success: boolean; error?: string }> {
  if (!isMailConfigured()) return mailNotReady();
  const client = await db();
  if (client) {
    const { error } = await client.from("contact_messages").insert({
      name: data.name,
      email: data.email,
      phone: data.phone ?? null,
      subject: data.subject ?? null,
      message: data.message,
      status: "new",
    });
    if (error) return { success: false, error: error.message };
  }

  const customer = contactCustomerEmail({ name: data.name });
  const staff = contactStaffEmail(data);

  const mailed = await sendPair(
    { to: data.email, ...customer },
    { to: staffInbox(), ...staff, replyTo: data.email }
  );
  if (!mailed.success) return mailed;

  return { success: true };
}
