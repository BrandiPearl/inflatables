"use client";

import { updateQuoteStatus, updateContactStatus } from "@/app/(cms)/admin/actions";
import { CONTACT_STATUSES, QUOTE_STATUSES } from "@/lib/cms/constants";
import type { ContactListItem, QuoteListItem } from "@/lib/queries/cms";

const QUOTE_COLORS: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700",
  contacted: "bg-blue-50 text-blue-700",
  quoted: "bg-purple-50 text-purple-700",
  booked: "bg-emerald-50 text-emerald-700",
  declined: "bg-red-50 text-red-700",
};

const CONTACT_COLORS: Record<string, string> = {
  new: "bg-amber-50 text-amber-700",
  read: "bg-blue-50 text-blue-700",
  replied: "bg-emerald-50 text-emerald-700",
  closed: "bg-slate-100 text-slate-600",
};

function formatDate(dateStr: string) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function QuoteCard({ quote }: { quote: QuoteListItem }) {
  return (
    <div className="bg-white rounded-xl border border-slate-100 p-5">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div>
          <div className="font-semibold text-slate-900">
            {quote.first_name} {quote.last_name}
            {quote.event_type === "Purchase" ? (
              <span className="ml-2 text-[10px] uppercase tracking-wide font-bold text-orange-700 bg-orange-50 rounded px-1.5 py-0.5">
                Order
              </span>
            ) : null}
          </div>
          <div className="text-xs text-slate-400 mt-0.5">
            {quote.email} · {quote.phone}
          </div>
        </div>
        <span className="text-xs text-slate-400 flex-shrink-0">{formatDate(quote.created_at)}</span>
      </div>

      <div className="flex flex-wrap gap-3 mb-3 text-xs text-slate-500">
        {(quote.city || quote.state) && <span>{[quote.city, quote.state, quote.zip].filter(Boolean).join(", ")}</span>}
        {quote.event_type && <span>{quote.event_type}</span>}
        {quote.event_date && <span>{formatDate(quote.event_date)}</span>}
        {quote.guests_count && quote.event_type !== "Purchase" && <span>{quote.guests_count} guests</span>}
        {quote.budget && quote.event_type === "Purchase" && <span>${Number(quote.budget).toLocaleString("en-US")}</span>}
      </div>

      {quote.products_interested.length > 0 ? (
        <ul className="text-xs text-slate-600 space-y-1 mb-3">
          {quote.products_interested.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      ) : null}

      <p className="text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3 whitespace-pre-line">{quote.message}</p>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <a href={`mailto:${quote.email}`} className="btn-secondary text-xs py-1.5 px-3">
          Reply by email
        </a>
        <form action={updateQuoteStatus} className="flex items-center gap-2">
          <input type="hidden" name="id" value={quote.id} />
          <select
            name="status"
            defaultValue={quote.status}
            className={`input text-xs py-1.5 w-auto ${QUOTE_COLORS[quote.status] ?? ""}`}
            onChange={(event) => event.currentTarget.form?.requestSubmit()}
          >
            {QUOTE_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </form>
      </div>
    </div>
  );
}

export function ContactCard({ message }: { message: ContactListItem }) {
  return (
    <div className="bg-white rounded-xl border border-slate-100 p-5">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div>
          <div className="font-semibold text-slate-900">{message.name}</div>
          <div className="text-xs text-slate-400 mt-0.5">
            {message.email}
            {message.phone ? ` · ${message.phone}` : ""}
          </div>
        </div>
        <span className="text-xs text-slate-400 flex-shrink-0">{formatDate(message.created_at)}</span>
      </div>
      {message.subject ? <div className="text-sm font-medium text-slate-700 mb-2">{message.subject}</div> : null}
      <p className="text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">{message.message}</p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <a href={`mailto:${message.email}`} className="btn-secondary text-xs py-1.5 px-3">
          Reply by email
        </a>
        <form action={updateContactStatus} className="flex items-center gap-2">
          <input type="hidden" name="id" value={message.id} />
          <select
            name="status"
            defaultValue={message.status}
            className={`input text-xs py-1.5 w-auto ${CONTACT_COLORS[message.status] ?? ""}`}
            onChange={(event) => event.currentTarget.form?.requestSubmit()}
          >
            {CONTACT_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </form>
      </div>
    </div>
  );
}
