import type { Metadata } from "next";
import { getContactMessages, getQuoteRequests } from "@/lib/queries/cms";
import { ContactCard, QuoteCard } from "@/components/cms/inbox-cards";

export const metadata: Metadata = { title: "Inbox" };

export default async function AdminQuotesPage() {
  const [quotes, contacts] = await Promise.all([getQuoteRequests(100), getContactMessages(100)]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-slate-900">Inbox</h1>
        <p className="text-slate-500 text-sm mt-0.5">
          {quotes.length} quote requests · {contacts.length} contact messages
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <section>
          <h2 className="text-sm font-bold text-slate-900 mb-3">Quote requests</h2>
          {quotes.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-100 p-8 text-sm text-slate-500">
              No quote requests yet. Submissions from the quote form will show up here.
            </div>
          ) : (
            <div className="space-y-3">
              {quotes.map((quote) => (
                <QuoteCard key={quote.id} quote={quote} />
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="text-sm font-bold text-slate-900 mb-3">Contact messages</h2>
          {contacts.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-100 p-8 text-sm text-slate-500">
              No contact messages yet.
            </div>
          ) : (
            <div className="space-y-3">
              {contacts.map((message) => (
                <ContactCard key={message.id} message={message} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
