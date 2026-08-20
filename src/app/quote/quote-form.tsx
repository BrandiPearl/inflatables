"use client";

import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useCart } from "@/components/cart/cart-provider";
import { useCurrency } from "@/components/currency/currency-provider";
import { submitQuoteRequest } from "@/app/storefront-actions";

const EVENT_TYPES = [
  "Birthday Party",
  "School Event",
  "Church Festival",
  "Corporate Event",
  "Community Fair",
  "Private Event",
  "Rental Business",
  "Other",
];

const HOW_DID_YOU_HEAR = [
  "Google Search",
  "Social Media",
  "Referral from friend/colleague",
  "Trade show",
  "Direct mail",
  "Other",
];

export function QuoteForm() {
  const { items } = useCart();
  const { format } = useCurrency();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    event_date: "",
    event_type: "",
    city: "",
    state: "",
    zip: "",
    guests_count: "",
    message: "",
    how_did_you_hear: "",
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await submitQuoteRequest({
      ...form,
      products_interested: items.map((item) => `${item.qty} x ${item.sku} ${item.name}`),
    });
    setLoading(false);
    if (!result.success) {
      setError(result.error ?? "Could not send your request. Please try again.");
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
        <h2 className="text-xl font-bold text-slate-900">Quote request received!</h2>
        <p className="mt-2 text-slate-500 text-sm max-w-sm">
          We emailed you a confirmation. We'll review your request and follow up within 2 business hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Contact info */}
      <div>
        <h2 className="text-base font-bold text-slate-900 mb-4">
          Your contact information
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label" htmlFor="first_name">First name *</label>
            <input
              id="first_name"
              name="first_name"
              type="text"
              required
              className="input"
              placeholder="John"
              value={form.first_name}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="label" htmlFor="last_name">Last name *</label>
            <input
              id="last_name"
              name="last_name"
              type="text"
              required
              className="input"
              placeholder="Smith"
              value={form.last_name}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="label" htmlFor="email">Email address *</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="input"
              placeholder="john@example.com"
              value={form.email}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="label" htmlFor="phone">Phone number *</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              className="input"
              value={form.phone}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      {/* Event details */}
      {items.length > 0 && (
        <div className="rounded-lg bg-orange-50 border border-orange-100 p-4">
          <h2 className="text-sm font-bold text-slate-900 mb-2">Items in your cart</h2>
          <ul className="text-sm text-slate-600 space-y-1">
            {items.map((item) => (
              <li key={item.id}>
                {item.qty} x {item.name} ({format(item.price)})
              </li>
            ))}
          </ul>
          <p className="text-xs text-slate-500 mt-2">These will be included with your quote request.</p>
        </div>
      )}

      <div className="pt-4 border-t border-slate-100">
        <h2 className="text-base font-bold text-slate-900 mb-4">
          Event / business details
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label" htmlFor="event_type">Type of event/use *</label>
            <select
              id="event_type"
              name="event_type"
              required
              className="input"
              value={form.event_type}
              onChange={handleChange}
            >
              <option value="">Select one</option>
              {EVENT_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="event_date">Expected date</label>
            <input
              id="event_date"
              name="event_date"
              type="date"
              className="input"
              value={form.event_date}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="label" htmlFor="city">City *</label>
            <input
              id="city"
              name="city"
              type="text"
              required
              className="input"
              placeholder="Los Angeles"
              value={form.city}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="label" htmlFor="state">State *</label>
            <input
              id="state"
              name="state"
              type="text"
              required
              className="input"
              placeholder="CA"
              maxLength={2}
              value={form.state}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="label" htmlFor="zip">ZIP code</label>
            <input
              id="zip"
              name="zip"
              type="text"
              className="input"
              placeholder="90001"
              value={form.zip}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="label" htmlFor="guests_count">Expected guests</label>
            <input
              id="guests_count"
              name="guests_count"
              type="text"
              className="input"
              placeholder="e.g. 50-100"
              value={form.guests_count}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      {/* Message */}
      <div className="pt-4 border-t border-slate-100">
        <label className="label" htmlFor="message">
          Tell us about your needs *
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className="input resize-none"
          placeholder="Which products are you interested in? Are you starting a rental business or planning a specific event? Any questions for us?"
          value={form.message}
          onChange={handleChange}
        />
      </div>

      <div>
        <label className="label" htmlFor="how_did_you_hear">How did you find us?</label>
        <select
          id="how_did_you_hear"
          name="how_did_you_hear"
          className="input"
          value={form.how_did_you_hear}
          onChange={handleChange}
        >
          <option value="">Select one (optional)</option>
          {HOW_DID_YOU_HEAR.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full py-3.5 text-base"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Submitting...
          </>
        ) : (
          "Submit Quote Request"
        )}
      </button>

      <p className="text-xs text-slate-400 text-center">
        We typically respond within 2 business hours. Your information is never
        shared with third parties.
      </p>
    </form>
  );
}
