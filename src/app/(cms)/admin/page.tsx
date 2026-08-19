import type { Metadata } from "next";
import Link from "next/link";
import {
  Package,
  FileText,
  MessageSquare,
  ShoppingBag,
  Star,
  ArrowRight,
} from "lucide-react";
import { AdminPageHeader } from "@/components/cms/admin-page-header";
import { getAdminStats, getQuoteRequests } from "@/lib/queries/cms";

export const metadata: Metadata = { title: "Dashboard" };

const QUICK_LINKS = [
  { label: "Products", desc: "Catalog and pricing", href: "/admin/products", icon: Package },
  { label: "Blog", desc: "Articles and guides", href: "/admin/blog", icon: FileText },
  { label: "Inbox", desc: "Quotes and messages", href: "/admin/quotes", icon: MessageSquare },
  { label: "Reviews", desc: "Homepage testimonials", href: "/admin/testimonials", icon: Star },
];

export default async function AdminDashboard() {
  const [stats, quotes] = await Promise.all([getAdminStats(), getQuoteRequests(5)]);

  const statCards = [
    { label: "Products", value: stats.products, icon: Package, hint: "Live in catalog" },
    { label: "Quote requests", value: stats.quotes, icon: ShoppingBag, hint: `${stats.contacts} contact messages` },
    { label: "Blog posts", value: stats.posts, icon: FileText, hint: "Published and drafts" },
    { label: "Reviews", value: stats.testimonials, icon: Star, hint: "Active testimonials" },
  ];

  return (
    <div>
      <AdminPageHeader
        title="Dashboard"
        description="Overview of your storefront content and incoming leads."
      />

      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="mb-4 flex items-center justify-between">
              <span className="spec text-[0.625rem] uppercase tracking-[0.14em] text-slate-500">
                {stat.label}
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
                <stat.icon className="h-4 w-4" />
              </div>
            </div>
            <div className="font-display text-3xl font-bold tracking-tight text-slate-900">
              {stat.value}
            </div>
            <p className="mt-1 text-xs text-slate-500">{stat.hint}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <h2 className="text-sm font-bold text-slate-900">Recent quote requests</h2>
              <Link
                href="/admin/quotes"
                className="inline-flex items-center gap-1 text-xs font-semibold text-orange-600 hover:text-orange-700"
              >
                View inbox
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            {quotes.length === 0 ? (
              <p className="px-5 py-10 text-sm text-slate-500">No quote requests yet.</p>
            ) : (
              <div className="divide-y divide-slate-100">
                {quotes.map((q) => (
                  <div key={q.id} className="flex items-center gap-4 px-5 py-4">
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-semibold text-slate-900">
                        {q.first_name} {q.last_name}
                      </div>
                      <div className="truncate text-xs text-slate-500">
                        {q.email} · {q.event_type || "Quote"}
                      </div>
                    </div>
                    <div className="shrink-0 text-xs text-slate-400">
                      {new Date(q.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                    <StatusBadge status={q.status} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="spec px-1 text-[0.625rem] uppercase tracking-[0.14em] text-slate-500">
            Quick links
          </h2>
          {QUICK_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-colors hover:border-orange-200 hover:bg-orange-50/40"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 group-hover:bg-orange-100 group-hover:text-orange-700">
                <link.icon className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold text-slate-900 group-hover:text-orange-700">
                  {link.label}
                </div>
                <div className="text-xs text-slate-500">{link.desc}</div>
              </div>
              <ArrowRight className="h-4 w-4 shrink-0 text-slate-300 group-hover:text-orange-500" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending: "bg-amber-50 text-amber-700",
    contacted: "bg-blue-50 text-blue-700",
    quoted: "bg-purple-50 text-purple-700",
    booked: "bg-emerald-50 text-emerald-700",
    declined: "bg-red-50 text-red-700",
  };
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-xs font-semibold capitalize ${map[status] ?? "bg-slate-100 text-slate-600"}`}
    >
      {status}
    </span>
  );
}
