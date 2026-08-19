import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Users, Globe, Award, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us | Wonderland Inflatables",
  description:
    "Learn about Wonderland Inflatables, 15+ years of manufacturing commercial grade bounce houses, water slides, and obstacle courses for rental businesses nationwide.",
};

const MILESTONES = [
  { year: "2008", event: "Founded in Ontario, California with a single warehouse and 12 designs." },
  { year: "2011", event: "Expanded manufacturing to 40,000 sq ft. Launched first water slide line." },
  { year: "2015", event: "Achieved ASTM F2374 certification across the full product catalog." },
  { year: "2018", event: "Reached 5,000 units delivered. Opened second distribution center in Texas." },
  { year: "2021", event: "Launched the JEM Club loyalty program for rental business operators." },
  { year: "2024", event: "12,000+ units in service. Serving customers in all 48 contiguous states." },
];

export default function AboutPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <div className="bg-slate-900 py-20">
        <div className="container-wide">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold text-orange-500 uppercase tracking-widest mb-3">
              Our Story
            </p>
            <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight">
              Built by operators,<br />
              <span className="text-orange-500">for operators</span>
            </h1>
            <p className="mt-5 text-slate-400 text-base leading-relaxed max-w-xl">
              Wonderland Inflatables was founded in 2008 by a team of inflatable rental
              operators who were frustrated with the poor build quality of available
              products. We set out to manufacture the inflatables we wished we could buy.
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="border-b border-slate-100">
        <div className="container-wide">
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-slate-100">
            {[
              { value: "15+", label: "Years in Business" },
              { value: "12,000+", label: "Units Delivered" },
              { value: "48", label: "States Served" },
              { value: "4.9★", label: "Average Rating" },
            ].map((s) => (
              <div key={s.label} className="py-8 px-6 text-center">
                <div className="text-3xl font-black text-slate-900">{s.value}</div>
                <div className="text-xs text-slate-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mission */}
      <div className="py-16 lg:py-20">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs font-semibold text-orange-600 uppercase tracking-widest mb-2">
                Our Mission
              </p>
              <h2 className="text-3xl font-bold text-slate-900 leading-tight">
                Empowering entrepreneurs through inflatables
              </h2>
              <p className="mt-4 text-slate-600 leading-relaxed">
                The inflatable rental business is one of the most accessible paths to
                entrepreneurship in America. Low startup costs, high demand, and a market
                that practically markets itself. We believe every serious operator deserves
                access to commercial grade equipment, not consumer grade products
                dressed up to look professional.
              </p>
              <p className="mt-4 text-slate-600 leading-relaxed">
                That means 18oz PVC vinyl, commercial blowers, quadruple stitched seams,
                and honest specs. No exaggerated claims, no hidden costs.
              </p>
              <Link href="/products" className="mt-6 inline-flex btn-primary">
                Browse Products <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Award, title: "ASTM Certified", body: "Full compliance with ASTM F2374 commercial inflatable safety standards." },
                { icon: Users, title: "Operator-Owned", body: "Founded and run by people who've operated rental businesses themselves." },
                { icon: Globe, title: "Ships Nationwide", body: "LTL freight delivery to all 48 contiguous US states." },
                { icon: Zap, title: "Fast ROI", body: "Most units pay for themselves within a single rental season." },
              ].map(({ icon: Icon, title, body }) => (
                <div key={title} className="rounded-xl border border-slate-100 p-5 bg-slate-50">
                  <div className="w-9 h-9 rounded-lg bg-orange-50 flex items-center justify-center mb-3">
                    <Icon className="w-4.5 h-4.5 text-orange-600" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mb-1">{title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="py-16 bg-slate-50 border-t border-slate-100">
        <div className="container-wide">
          <div className="max-w-xl mb-10">
            <p className="text-xs font-semibold text-orange-600 uppercase tracking-widest mb-2">
              Our Journey
            </p>
            <h2 className="text-3xl font-bold text-slate-900">15 years of growth</h2>
          </div>
          <div className="space-y-0">
            {MILESTONES.map((m, i) => (
              <div key={m.year} className="flex gap-6">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-orange-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold">{m.year.slice(2)}</span>
                  </div>
                  {i < MILESTONES.length - 1 && (
                    <div className="w-px flex-1 bg-slate-200 my-1" />
                  )}
                </div>
                <div className="pb-8">
                  <div className="text-sm font-bold text-slate-900">{m.year}</div>
                  <p className="mt-1 text-sm text-slate-600">{m.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="py-14 bg-orange-600">
        <div className="container-wide text-center">
          <h2 className="text-2xl font-bold text-white">
            Ready to work with us?
          </h2>
          <p className="mt-2 text-orange-100 text-sm max-w-md mx-auto">
            Talk to our team about your rental business goals and we'll help you
            build the right fleet.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link href="/quote" className="inline-flex items-center rounded-md bg-white px-6 py-3 text-sm font-bold text-orange-600 hover:bg-orange-50 transition-colors">
              Get a Free Quote
            </Link>
            <Link href="/contact" className="inline-flex items-center rounded-md border border-white/40 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
