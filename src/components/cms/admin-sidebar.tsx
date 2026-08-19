"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import {
  Package,
  FileText,
  MessageSquare,
  Settings,
  LayoutDashboard,
  Star,
  ExternalLink,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui/logo";
import { LogoutButton } from "@/components/cms/logout-button";

const NAV_MAIN = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
];

const NAV_CONTENT = [
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Blog", href: "/admin/blog", icon: FileText },
  { label: "Reviews", href: "/admin/testimonials", icon: Star },
];

const NAV_SYSTEM = [
  { label: "Inbox", href: "/admin/quotes", icon: MessageSquare },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

function isActive(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin";
  return pathname.startsWith(href);
}

function NavLink({
  item,
  pathname,
  onNavigate,
}: {
  item: { label: string; href: string; icon: LucideIcon };
  pathname: string;
  onNavigate?: () => void;
}) {
  const active = isActive(pathname, item.href);
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
        active
          ? "bg-orange-600 text-white shadow-sm"
          : "text-slate-300 hover:bg-white/8 hover:text-white"
      )}
    >
      <item.icon className={cn("h-4 w-4 shrink-0", active ? "text-white" : "text-slate-400")} />
      {item.label}
    </Link>
  );
}

function NavSection({
  title,
  items,
  pathname,
  onNavigate,
}: {
  title: string;
  items: typeof NAV_MAIN;
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <div>
      <p className="spec mb-2 px-3 text-[0.625rem] uppercase tracking-[0.16em] text-slate-500">
        {title}
      </p>
      <div className="space-y-0.5">
        {items.map((item) => (
          <NavLink key={item.href} item={item} pathname={pathname} onNavigate={onNavigate} />
        ))}
      </div>
    </div>
  );
}

export function AdminSidebar({
  mobileOpen,
  onMobileClose,
}: {
  mobileOpen: boolean;
  onMobileClose: () => void;
}) {
  const pathname = usePathname();

  const panel = (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-5">
        <Logo variant="light" size="sm" href="/admin" />
        <button
          type="button"
          onClick={onMobileClose}
          className="rounded-md p-1.5 text-slate-400 hover:bg-white/10 hover:text-white lg:hidden"
          aria-label="Close menu"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
        <NavSection title="Overview" items={NAV_MAIN} pathname={pathname} onNavigate={onMobileClose} />
        <NavSection title="Content" items={NAV_CONTENT} pathname={pathname} onNavigate={onMobileClose} />
        <NavSection title="System" items={NAV_SYSTEM} pathname={pathname} onNavigate={onMobileClose} />
      </nav>

      <div className="border-t border-white/10 px-3 py-4 space-y-1">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-400 transition-colors hover:bg-white/8 hover:text-white"
        >
          <ExternalLink className="h-4 w-4 shrink-0" />
          View storefront
        </Link>
        <LogoutButton variant="sidebar" />
      </div>
    </div>
  );

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden"
          onClick={onMobileClose}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-[260px] bg-slate-900 transition-transform duration-200 lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {panel}
      </aside>
    </>
  );
}
