import type { Metadata } from "next";
import Link from "next/link";
import {
  Package,
  FileText,
  MessageSquare,
  ShoppingBag,
  Star,
} from "lucide-react";
import { getAdminStats, getQuoteRequests } from "@/lib/queries/cms";

export const metadata: Metadata = { title: "Dashboard" };

const QUICK_LINKS = [
  { label: "Products", desc: "Manage your product catalog", href: "/admin/products", icon: Package, color: "bg-orange-50 text-orange-600" },
  { label: "Blog Posts", desc: "Write and publish articles", href: "/admin/blog", icon: FileText, color: "bg-blue-50 text-blue-600" },
  { label: "Inbox", desc: "Quotes and contact messages", href: "/admin/quotes", icon: MessageSquare, color: "bg-emerald-50 text-emerald-600" },
  { label: "Reviews", desc: "Homepage testimonials", href: "/admin/testimonials", icon: Star, color: "bg-amber-50 text-amber-600" },
];

export default async function AdminDashboard() {
  const [stats, quotes] = await Promise.all([getAdminStats(), getQuoteRequests(4)]);

  const statCards = [
    { label: "Total Products", value: String(stats.products), icon: Package, change: "Live catalog" },
    { label: "Quote Requests", value: String(stats.quotes), icon: ShoppingBag, change: `${stats.contacts} contact messages` },
    { label: "Blog Posts", value: String(stats.posts), icon: FileText, change: "Published and drafts" },
    { label: "Reviews", value: String(stats.testimonials), icon: Star, change: "Active testimonials" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">Welcome back. Here's what's happening.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-slate-100 p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                {stat.label}
              </span>
              <stat.icon className="w-4 h-4 text-slate-400" />
            </div>
            <div className="text-2xl font-black text-slate-900">{stat.value}</div>
            <div className="text-xs text-slate-400 mt-1">{stat.change}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {QUICK_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="bg-white rounded-xl border border-slate-100 p-5 hover:border-slate-200 transition-all group"
          >
            <div className={`w-10 h-10 rounded-lg ${link.color} flex items-center justify-center mb-4`}>
              <link.icon className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
              {link.label}
            </h3>
            <p className="text-xs text-slate-500 mt-1">{link.desc}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 bg-white rounded-xl border border-slate-100">
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <h2 className="text-sm font-bold text-slate-900">Recent Quote Requests</h2>
          <Link href="/admin/quotes" className="text-xs text-orange-600 font-semibold hover:underline">
            View all
          </Link>
        </div>
        {quotes.length === 0 ? (
          <p className="px-5 py-8 text-sm text-slate-500">No quote requests yet.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {quotes.map((q) => (
              <div key={q.id} className="flex items-center gap-4 px-5 py-3.5">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-slate-900 truncate">
                    {q.first_name} {q.last_name}
                  </div>
                  <div className="text-xs text-slate-400 truncate">
                    {q.email} · {q.event_type || "Quote"}
                  </div>
                </div>
                <div className="text-xs text-slate-400 flex-shrink-0">
                  {new Date(q.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </div>
                <StatusBadge status={q.status} />
              </div>
            ))}
          </div>
        )}
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
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold capitalize ${map[status] ?? "bg-slate-100 text-slate-600"}`}>
      {status}
    </span>
  );
}
