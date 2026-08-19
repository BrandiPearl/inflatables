"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/ui/logo";
import {
  Package,
  FileText,
  MessageSquare,
  Settings,
  LayoutDashboard,
  Star,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { LogoutButton } from "@/components/cms/logout-button";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Blog", href: "/admin/blog", icon: FileText },
  { label: "Inbox", href: "/admin/quotes", icon: MessageSquare },
  { label: "Reviews", href: "/admin/testimonials", icon: Star },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminNav() {
  const pathname = usePathname();
  if (pathname === "/admin/login") return null;

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      <div className="container-wide h-14 flex items-center justify-between gap-4">
        <div className="flex items-center gap-6 min-w-0">
          <Logo size="sm" href="/admin" />
          <nav className="hidden md:flex items-center gap-0.5 overflow-x-auto">
            {NAV_ITEMS.map((item) => {
              const active =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md transition-colors whitespace-nowrap",
                    active
                      ? "bg-orange-50 text-orange-700 font-semibold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  )}
                >
                  <item.icon className="w-3.5 h-3.5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-700 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            View Site
          </Link>
          <LogoutButton />
        </div>
      </div>
      <nav className="md:hidden container-wide flex items-center gap-1 overflow-x-auto pb-2">
        {NAV_ITEMS.map((item) => {
          const active =
            item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md transition-colors whitespace-nowrap",
                active
                  ? "bg-orange-50 text-orange-700 font-semibold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              )}
            >
              <item.icon className="w-3.5 h-3.5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
