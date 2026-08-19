"use client";

import { useState, useEffect, useRef, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui/logo";
import { CartButton } from "@/components/cart/cart-button";
import { SearchDialog } from "@/components/layout/search-dialog";
import { CurrencySelect } from "@/components/currency/currency-select";
import { useCurrency } from "@/components/currency/currency-provider";
import { useSettings } from "@/components/layout/settings-provider";
import { localizeUsdAmountsInText } from "@/lib/currency";

const CATEGORY_LINKS = [
  { label: "Bounce Houses", href: "/products?category=bounce-houses" },
  { label: "Water Slides", href: "/products?category=water-slides" },
  { label: "Combo Units", href: "/products?category=combos" },
  { label: "Obstacle Courses", href: "/products?category=obstacle-courses" },
  { label: "Interactive Games", href: "/products?category=interactive" },
  { label: "Tents & Tables", href: "/products?category=tents-tables" },
  { label: "Concessions", href: "/products?category=concessions" },
];

const NAV_LINKS: {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
}[] = [
  { label: "Products", href: "/products", children: CATEGORY_LINKS },
  { label: "Rentals", href: "/rentals" },
  { label: "FAQ", href: "/faq" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

function subscribeToScroll(onChange: () => void) {
  window.addEventListener("scroll", onChange, { passive: true });
  return () => window.removeEventListener("scroll", onChange);
}

export function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const settings = useSettings();
  const { format } = useCurrency();
  const announcementText = settings.announcement
    ? localizeUsdAmountsInText(settings.announcement, format)
    : "";
  const scrolled = useSyncExternalStore(
    subscribeToScroll,
    () => window.scrollY > 8,
    () => false
  );

  useEffect(() => {
    setMobileOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  // Escape closes the open panel wherever focus happens to be.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveDropdown(null);
        setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  function openDropdown(label: string) {
    if (timerRef.current) clearTimeout(timerRef.current);
    setActiveDropdown(label);
  }

  function closeDropdown() {
    timerRef.current = setTimeout(() => setActiveDropdown(null), 130);
  }

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href.split("?")[0]);

  return (
    <>
      {settings.announcement ? (
        <div className="bg-slate-900 px-4 py-2.5 text-center text-white">
          <span className="spec text-[0.6875rem] uppercase tracking-[0.14em]">
            {announcementText}
          </span>
          {settings.announcement_link_text ? (
            <>
              <span className="mx-2.5 text-white/25">/</span>
              <Link
                href={settings.announcement_link_url || "/quote"}
                className="spec whitespace-nowrap text-[0.6875rem] uppercase tracking-[0.14em] text-orange-400 underline underline-offset-4 hover:text-orange-300"
              >
                {settings.announcement_link_text}
              </Link>
            </>
          ) : null}
        </div>
      ) : null}

      <header
        className={cn(
          "sticky top-0 z-50 w-full border-b bg-white transition-shadow duration-200",
          scrolled
            ? "border-slate-200 shadow-[0_1px_16px_rgba(27,23,18,0.07)]"
            : "border-slate-200"
        )}
      >
        <div className="container-wide">
          <div className="flex h-[4.5rem] items-center justify-between gap-6">
            <Logo size="sm" />

            {/* Desktop navigation. Active state is an underline rule rather
                than a tinted pill — quieter, and it survives dark headers. */}
            <nav className="hidden items-center gap-1 lg:flex">
              {NAV_LINKS.map((link) =>
                link.children ? (
                  <div
                    key={link.label}
                    className="relative"
                    onMouseEnter={() => openDropdown(link.label)}
                    onMouseLeave={closeDropdown}
                  >
                    <button
                      type="button"
                      aria-expanded={activeDropdown === link.label}
                      onFocus={() => openDropdown(link.label)}
                      onClick={() =>
                        setActiveDropdown(
                          activeDropdown === link.label ? null : link.label
                        )
                      }
                      className={cn(
                        "relative flex items-center gap-1.5 px-3 py-6 text-[0.9375rem] font-medium transition-colors",
                        isActive(link.href) || activeDropdown === link.label
                          ? "text-slate-900"
                          : "text-slate-600 hover:text-slate-900"
                      )}
                    >
                      {link.label}
                      <ChevronDown
                        className={cn(
                          "h-3.5 w-3.5 transition-transform duration-200",
                          activeDropdown === link.label && "rotate-180"
                        )}
                      />
                      {isActive(link.href) && (
                        <span className="absolute inset-x-3 bottom-0 h-[2px] bg-orange-600" />
                      )}
                    </button>

                    {activeDropdown === link.label && (
                      <div
                        className="absolute left-1/2 top-full z-50 -translate-x-1/2"
                        onMouseEnter={() => openDropdown(link.label)}
                        onMouseLeave={closeDropdown}
                      >
                        <div className="w-[30rem] rounded-lg border border-slate-200 bg-white p-2 shadow-[0_18px_44px_rgba(27,23,18,0.12)]">
                          <div className="grid grid-cols-2 gap-0.5">
                            {link.children.map((child) => (
                              <Link
                                key={child.href}
                                href={child.href}
                                className="rounded-md px-3.5 py-2.5 text-sm text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900"
                              >
                                {child.label}
                              </Link>
                            ))}
                          </div>
                          <Link
                            href="/products"
                            className="mt-2 flex items-center justify-between rounded-md border-t border-slate-200 px-3.5 pb-1 pt-3 text-sm font-semibold text-orange-700 hover:text-orange-600"
                          >
                            View all products
                            <span aria-hidden>&rarr;</span>
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "relative px-3 py-6 text-[0.9375rem] font-medium transition-colors",
                      isActive(link.href)
                        ? "text-slate-900"
                        : "text-slate-600 hover:text-slate-900"
                    )}
                  >
                    {link.label}
                    {isActive(link.href) && (
                      <span className="absolute inset-x-3 bottom-0 h-[2px] bg-orange-600" />
                    )}
                  </Link>
                )
              )}
            </nav>

            <div className="flex items-center gap-1.5">
              <CurrencySelect />

              <button
                type="button"
                aria-label="Search products"
                className="btn-ghost px-2.5 py-2.5"
                onClick={() => setSearchOpen(true)}
              >
                <Search className="h-[1.125rem] w-[1.125rem]" />
              </button>

              <CartButton />

              <Link
                href="/quote"
                className="btn-primary ml-1.5 hidden px-4 py-2.5 text-[0.8125rem] sm:inline-flex"
              >
                Get a quote
              </Link>

              <button
                type="button"
                onClick={() => setMobileOpen(!mobileOpen)}
                className="btn-ghost px-2.5 py-2.5 lg:hidden"
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileOpen}
              >
                {mobileOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {mobileOpen && (
          <div className="max-h-[calc(100dvh-4.5rem)] overflow-y-auto border-t border-slate-200 bg-white lg:hidden">
            <div className="container-wide py-3">
              {NAV_LINKS.map((link) => (
                <div key={link.label} className="border-b border-slate-200 py-1">
                  <Link
                    href={link.href}
                    className="block py-3 font-display text-base font-bold tracking-tight text-slate-900"
                  >
                    {link.label}
                  </Link>
                  {link.children && (
                    <div className="grid grid-cols-2 gap-x-4 pb-3">
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="py-1.5 text-sm text-slate-600 hover:text-orange-700"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              <div className="space-y-2.5 py-5">
                <Link href="/quote" className="btn-primary w-full">
                  Get a free quote
                </Link>
                <Link href="/cart" className="btn-secondary w-full">
                  View cart
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
