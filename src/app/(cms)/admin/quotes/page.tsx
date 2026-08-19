import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/cms/admin-page-header";
import { getContactMessages, getQuoteRequests } from "@/lib/queries/cms";
import { ContactCard, QuoteCard } from "@/components/cms/inbox-cards";

export const metadata: Metadata = { title: "Inbox" };

export default async function AdminQuotesPage() {
  const [quotes, contacts] = await Promise.all([getQuoteRequests(100), getContactMessages(100)]);

  return (
    <div>
      <AdminPageHeader
        title="Inbox"
        description={`${quotes.length} quote requests · ${contacts.length} contact messages`}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <section>
          <h2 className="mb-3 text-sm font-bold text-slate-900">Quote requests</h2>
          {quotes.length === 0 ? (
            <div className="rounded-xl border border-slate-200 bg-white p-8 text-sm text-slate-500 shadow-sm">
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
          <h2 className="mb-3 text-sm font-bold text-slate-900">Contact messages</h2>
          {contacts.length === 0 ? (
            <div className="rounded-xl border border-slate-200 bg-white p-8 text-sm text-slate-500 shadow-sm">
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
