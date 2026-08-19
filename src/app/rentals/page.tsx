import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Mail, CheckCircle2 } from "lucide-react";
import {
  Cake,
  GraduationCap,
  Church,
  Building2,
  Sun,
  Tent,
} from "lucide-react";
import { getFeaturedProducts } from "@/lib/queries/products";
import { ProductCard } from "@/components/ui/product-card";
import { getSiteSettings } from "@/lib/queries/settings";
import { mailHref } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Inflatable Rentals | Bounce Houses, Water Slides & Obstacle Courses",
  description:
    "Rent commercial grade bounce houses, water slides, obstacle courses, and combo inflatables for your next event. Perfect for birthday parties, school events, church festivals, and corporate events.",
};

const RENTAL_TYPES = [
  { label: "Birthday Parties", icon: Cake, href: "/products?category=bounce-houses" },
  { label: "School Events", icon: GraduationCap, href: "/products?category=obstacle-courses" },
  { label: "Church Festivals", icon: Church, href: "/products" },
  { label: "Corporate Events", icon: Building2, href: "/products" },
  { label: "Summer Camps", icon: Sun, href: "/products?category=water-slides" },
  { label: "Large Festivals", icon: Tent, href: "/products?category=obstacle-courses" },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Browse & Request",
    body: "Browse our catalog and request a quote for the units you're interested in. Tell us your event date, location, and number of guests.",
  },
  {
    step: "02",
    title: "We Confirm & Quote",
    body: "Our team will confirm availability, provide exact pricing including delivery, and answer any questions about setup requirements.",
  },
  {
    step: "03",
    title: "Delivery & Setup",
    body: "We deliver and fully set up every unit on your event day. Setup typically takes 15-25 minutes per unit. We handle everything.",
  },
  {
    step: "04",
    title: "Enjoy Your Event",
    body: "Everything is running, just enjoy your event. We provide an on-call contact number for any questions during your rental.",
  },
  {
    step: "05",
    title: "We Pick It Up",
    body: "After your event, we return to deflate, clean, and pick up all equipment. No mess, no hassle.",
  },
];

export default async function RentalsPage() {
  const [rentalCatalog, settings] = await Promise.all([
    getFeaturedProducts(6),
    getSiteSettings(),
  ]);
  const rentalProducts = rentalCatalog.filter((p) => p.rental_available);
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-slate-950 min-h-[480px]">
        <Image
          src="/images/hero-inflatables.jpg"
          alt="Inflatable rentals at an outdoor event"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-slate-950/75" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-transparent" />
        <div className="relative container-wide py-16 sm:py-20">
          <div className="max-w-2xl">
            <p className="eyebrow text-orange-300">Inflatable Rentals</p>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight font-display">
              Bring the fun to<br />
              <span className="text-orange-500">your next event</span>
            </h1>
            <p className="mt-5 text-slate-400 text-base leading-relaxed max-w-xl">
              Commercial grade bounce houses, water slides, obstacle courses, and
              interactive games, delivered, set up, and picked up by our team.
              Serving events of all sizes across the US.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/quote" className="btn-primary text-base px-7 py-3.5">
                Book a Rental
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a href={mailHref(settings.email)} className="btn-secondary text-base px-7 py-3.5 bg-transparent border-slate-600 text-white hover:bg-white/10 hover:border-slate-500">
                <Mail className="w-4 h-4" />
                Email us
              </a>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
              {[
                "Setup & teardown included",
                "On-call support during your event",
                "No hidden fees",
              ].map((t) => (
                <div key={t} className="flex items-center gap-2 text-slate-400 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-orange-500" />
                  {t}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Event types */}
      <section className="py-16 bg-white border-b border-slate-100">
        <div className="container-wide">
          <div className="mb-10">
            <p className="text-xs font-semibold text-orange-600 uppercase tracking-widest mb-2">
              Perfect for
            </p>
            <h2 className="section-heading">Every type of event</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {RENTAL_TYPES.map((type) => {
              const Icon = type.icon;
              return (
              <Link
                key={type.label}
                href={type.href}
                className="group card-hover rounded-2xl border border-slate-200 bg-white p-5 text-center"
              >
                <div className="w-10 h-10 mx-auto mb-3 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                  <Icon className="w-5 h-5" strokeWidth={1.75} />
                </div>
                <div className="text-xs font-semibold text-slate-900 group-hover:text-orange-700 transition-colors">
                  {type.label}
                </div>
              </Link>
            );})}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 lg:py-20 bg-slate-50">
        <div className="container-wide">
          <div className="max-w-xl mb-12">
            <p className="text-xs font-semibold text-orange-600 uppercase tracking-widest mb-2">
              The Process
            </p>
            <h2 className="section-heading">How renting works</h2>
            <p className="section-subheading mt-3">
              From booking to teardown, we handle everything so you can focus on
              enjoying your event.
            </p>
          </div>

          <div className="relative">
            {/* Connector line (desktop) */}
            <div className="hidden lg:block absolute top-7 left-7 right-7 h-px bg-slate-200" />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-4">
              {HOW_IT_WORKS.map((step) => (
                <div key={step.step} className="relative flex flex-col">
                  <div className="w-14 h-14 rounded-full bg-orange-600 flex items-center justify-center mb-4 flex-shrink-0 relative z-10">
                    <span className="text-white font-black text-sm">{step.step}</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mb-1.5">{step.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{step.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Rental products */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container-wide">
          <div className="flex items-end justify-between gap-6 mb-10">
            <div>
              <p className="text-xs font-semibold text-orange-600 uppercase tracking-widest mb-2">
                Available to Rent
              </p>
              <h2 className="section-heading">Popular rental units</h2>
            </div>
            <Link href="/products" className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-slate-700 hover:text-orange-600 transition-colors flex-shrink-0">
              All products <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {rentalProducts.map((p, i) => (
              <ProductCard key={p.id} product={p} priority={i < 3} />
            ))}
          </div>
        </div>
      </section>

      {/* Pricing transparency */}
      <section className="py-16 bg-slate-50 border-t border-slate-100">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <p className="text-xs font-semibold text-orange-600 uppercase tracking-widest mb-2">
                Transparent Pricing
              </p>
              <h2 className="text-3xl font-bold text-slate-900">
                What's included in every rental
              </h2>
              <p className="mt-4 text-slate-600 text-sm leading-relaxed">
                We don't do hidden fees. Your rental quote covers everything listed
                below. The only variables are the unit(s) you choose and your
                delivery distance.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  "Professional delivery to your event location",
                  "Full setup by our trained technicians",
                  "Commercial blowers (remain running during rental)",
                  "Safety briefing for your event staff",
                  "On-call support number during your rental",
                  "Post-event teardown and removal",
                  "All safety equipment (stakes, sandbags)",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900 mb-4">
                Typical rental price ranges
              </h3>
              {[
                { unit: "Standard Bounce House", range: "$200-$350", duration: "per day" },
                { unit: "Combo Unit (bounce + slide)", range: "$350-$550", duration: "per day" },
                { unit: "Water Slide (15-20ft)", range: "$400-$650", duration: "per day" },
                { unit: "Water Slide (25-28ft)", range: "$600-$900", duration: "per day" },
                { unit: "Obstacle Course (20-30ft)", range: "$450-$700", duration: "per day" },
                { unit: "Obstacle Course (40ft+)", range: "$700-$1,100", duration: "per day" },
                { unit: "Interactive Game", range: "$200-$450", duration: "per day" },
              ].map((row) => (
                <div
                  key={row.unit}
                  className="flex items-center justify-between gap-4 px-4 py-3 rounded-lg bg-white border border-slate-100"
                >
                  <span className="text-sm text-slate-700">{row.unit}</span>
                  <div className="text-right flex-shrink-0">
                    <div className="text-sm font-bold text-slate-900">{row.range}</div>
                    <div className="text-xs text-slate-400">{row.duration}</div>
                  </div>
                </div>
              ))}
              <p className="text-xs text-slate-400 pt-1">
                * Prices vary by unit, location, and event duration. Delivery fees
                apply for locations more than 30 miles from our warehouse.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-orange-600">
        <div className="container-wide text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Ready to book your rental?
          </h2>
          <p className="mt-3 text-orange-100 text-sm max-w-md mx-auto">
            Fill out our quick quote form and we'll get back to you within 2 hours
            with availability and pricing.
          </p>
          <div className="mt-7 flex flex-wrap gap-3 justify-center">
            <Link href="/quote" className="inline-flex items-center gap-2 rounded-md bg-white px-7 py-3.5 text-sm font-bold text-orange-600 hover:bg-orange-50 transition-colors">
              Book Now <ArrowRight className="w-4 h-4" />
            </Link>
            <a href={mailHref(settings.email)} className="inline-flex items-center gap-2 rounded-md border border-white/40 px-7 py-3.5 text-sm font-semibold text-white hover:bg-white/10 transition-colors">
              <Mail className="w-4 h-4" />
              Email us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
