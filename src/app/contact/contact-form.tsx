"use client";

import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { submitContactMessage } from "@/app/storefront-actions";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await submitContactMessage(form);
    setLoading(false);
    if (!result.success) {
      setError(result.error ?? "Could not send your message. Please try again.");
      return;
    }
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="py-16 flex flex-col items-center text-center">
        <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center mb-5">
          <CheckCircle2 className="w-7 h-7 text-emerald-500" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Message sent!</h2>
        <p className="mt-2 text-slate-500 text-sm max-w-sm">
          Thank you for reaching out. We emailed you a copy and will reply within 2 business hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="label" htmlFor="name">Full name *</label>
          <input id="name" name="name" type="text" required className="input" placeholder="Jane Smith" value={form.name} onChange={handleChange} />
        </div>
        <div>
          <label className="label" htmlFor="email">Email address *</label>
          <input id="email" name="email" type="email" required className="input" placeholder="jane@example.com" value={form.email} onChange={handleChange} />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="label" htmlFor="phone">Phone</label>
          <input id="phone" name="phone" type="tel" className="input" placeholder="(555) 000-0000" value={form.phone} onChange={handleChange} />
        </div>
        <div>
          <label className="label" htmlFor="subject">Subject *</label>
          <select id="subject" name="subject" required className="input" value={form.subject} onChange={handleChange}>
            <option value="">Select a topic</option>
            <option>Product Questions</option>
            <option>Order Status</option>
            <option>Shipping & Delivery</option>
            <option>Returns & Warranty</option>
            <option>Partnership Inquiry</option>
            <option>Other</option>
          </select>
        </div>
      </div>
      <div>
        <label className="label" htmlFor="message">Message *</label>
        <textarea id="message" name="message" required rows={6} className="input resize-none" placeholder="How can we help you?" value={form.message} onChange={handleChange} />
      </div>
      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2">
          {error}
        </p>
      )}
      <button type="submit" disabled={loading} className="btn-primary py-3 text-sm">
        {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</> : "Send Message"}
      </button>
    </form>
  );
}
