"use client";

import Link from "next/link";
import { Mail } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { useSettings } from "@/components/layout/settings-provider";
import { mailHref } from "@/lib/utils";

const COLUMNS: { heading: string; links: { label: string; href: string }[] }[] = [
  {
    heading: "Catalogue",
    links: [
      { label: "Bounce Houses", href: "/products?category=bounce-houses" },
      { label: "Water Slides", href: "/products?category=water-slides" },
      { label: "Combo Units", href: "/products?category=combos" },
      { label: "Obstacle Courses", href: "/products?category=obstacle-courses" },
      { label: "Interactive Games", href: "/products?category=interactive" },
      { label: "Tents & Tables", href: "/products?category=tents-tables" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Blog", href: "/blog" },
      { label: "Careers", href: "/careers" },
      { label: "Press", href: "/press" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    heading: "Support",
    links: [
      { label: "Get a Quote", href: "/quote" },
      { label: "Shipping Info", href: "/shipping" },
      { label: "Returns & Warranty", href: "/returns" },
      { label: "Setup Guides", href: "/guides" },
      { label: "Safety Guidelines", href: "/safety" },
      { label: "FAQs", href: "/faq" },
    ],
  },
];

export function Footer() {
  const settings = useSettings();

  return (
    <footer className="bg-slate-900 text-slate-300">
      {/* Closing appeal. Set large, because on most pages this is the last
          thing a buyer reads before leaving. */}
      <div className="border-b border-white/10">
        <div className="container-wide py-10 lg:py-12">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <h2 className="display-lg max-w-2xl text-white">
              Ready to start your inflatable business?
            </h2>
            <div className="flex flex-shrink-0 flex-col gap-3 sm:flex-row">
              <Link href="/quote" className="btn-primary px-7 py-4">
                Get a free quote
              </Link>
              <a
                href={mailHref(settings.email)}
                className="spec inline-flex items-center justify-center gap-2 rounded-md border border-white/25 px-7 py-4 text-sm font-medium text-white transition-colors hover:border-white/50 hover:bg-white/5"
              >
                Email us
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="container-wide py-10 lg:py-12">
        <div className="grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Logo variant="light" size="sm" />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-slate-400">
              Commercial grade inflatables built for rental businesses, event
              companies and large-scale events. Manufacturing since 2008.
            </p>

            <div className="mt-7">
              <a
                href={mailHref(settings.email)}
                className="flex items-center gap-3 text-sm text-slate-400 transition-colors hover:text-white"
              >
                <Mail className="h-3.5 w-3.5 flex-shrink-0 text-orange-500" />
                {settings.email}
              </a>
            </div>
          </div>

          {COLUMNS.map((col) => (
            <nav key={col.heading} className="lg:col-span-2 lg:col-start-auto">
              <h3 className="spec mb-5 text-[0.625rem] uppercase tracking-[0.18em] text-white/40">
                {col.heading}
              </h3>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-400 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div className="lg:col-span-2">
            <h3 className="spec mb-5 text-[0.625rem] uppercase tracking-[0.18em] text-white/40">
              Certification
            </h3>
            <p className="text-sm leading-relaxed text-slate-400">
              All units meet ASTM F2374 and CPSC standards. Documentation ships
              with every order.
            </p>
            <p className="spec mt-4 text-[0.6875rem] uppercase tracking-[0.14em] text-orange-500">
              18oz PVC · Lead free
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-wide flex flex-col items-center justify-between gap-4 py-6 sm:flex-row">
          <p className="spec text-[0.6875rem] text-slate-500">
            &copy; {new Date().getFullYear()} Wonderland Inflatables
          </p>
          <div className="flex items-center gap-6">
            {[
              { label: "Privacy", href: "/privacy" },
              { label: "Terms", href: "/terms" },
              { label: "Sitemap", href: "/sitemap.xml" },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="spec text-[0.6875rem] uppercase tracking-[0.12em] text-slate-500 transition-colors hover:text-slate-300"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
