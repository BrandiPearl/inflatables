import type { Metadata } from "next";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { BUSINESS_EMAIL, mailHref } from "@/lib/contact-info";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Answers to the most common questions about buying, renting, and operating commercial inflatables from Wonderland Inflatables.",
};

const FAQ_SECTIONS = [
  {
    section: "Buying & Ordering",
    faqs: [
      {
        q: "What makes Wonderland Inflatables different from other suppliers?",
        a: "All of our inflatables are built from 18oz commercial grade PVC vinyl with quadruple stitched seams and commercial grade blowers. We don't sell consumer grade units repackaged as commercial, everything in our catalog is purpose built for daily rental use and heavy commercial operation.",
      },
      {
        q: "Do you offer financing or payment plans?",
        a: "Yes. We work with several equipment financing partners who specialize in inflatable rental businesses. Approved operators can finance purchases with as little as 10% down and terms up to 60 months. Contact our sales team for a no obligation financing quote.",
      },
      {
        q: "What is included with my purchase?",
        a: "Every unit ships with the inflatable, commercial blower(s), ground stakes, tie-down straps, a commercial patch repair kit, and a heavy duty storage/carry bag. Setup instructions and a safety checklist are included digitally.",
      },
      {
        q: "Can I see the product before I buy?",
        a: `Yes, we have a showroom at our Ontario, CA warehouse. You can visit by appointment Monday-Friday, 8am-4pm PST. Email ${BUSINESS_EMAIL} to schedule. If you can't visit in person, we can arrange a live video walkthrough of any unit.`,
      },
      {
        q: "Do you offer bulk or wholesale pricing?",
        a: "Yes. Operators purchasing 3+ units receive tiered discounts starting at 5%. For orders of 10+ units, contact us for a custom wholesale quote. We've helped dozens of operators build their initial fleets from scratch.",
      },
    ],
  },
  {
    section: "Shipping & Delivery",
    faqs: [
      {
        q: "Where do you ship?",
        a: "We ship to all 48 contiguous US states via LTL freight. We do not currently ship to Alaska, Hawaii, or internationally. Most orders ship from our Ontario, CA warehouse within 3-5 business days of payment confirmation.",
      },
      {
        q: "How much does shipping cost?",
        a: "Shipping is calculated based on weight, dimensions, and delivery zip code. Orders over $2,500 qualify for free terminal shipping (delivery to a local freight terminal for customer pickup). Home delivery (liftgate service) is available for an additional fee. Contact us for a specific shipping quote.",
      },
      {
        q: "How long does delivery take?",
        a: "Transit times vary by destination but typically range from 3-7 business days from ship date. West Coast deliveries are often 2-3 days; East Coast deliveries average 5-7 days.",
      },
      {
        q: "What if my unit arrives damaged?",
        a: "Inspect your delivery thoroughly before signing the bill of lading. Note any visible damage on the delivery receipt. Take photographs of all damage before moving the unit. Contact us within 48 hours of delivery and we will work with the freight carrier and our quality team to resolve the issue at no cost to you.",
      },
    ],
  },
  {
    section: "Safety & Compliance",
    faqs: [
      {
        q: "Are your inflatables ASTM certified?",
        a: "Yes. All Wonderland Inflatables products meet or exceed ASTM F2374 standards for commercial use inflatables. Certification documentation is available upon request and required for insurance and permit purposes in most states.",
      },
      {
        q: "What insurance do I need to operate commercially?",
        a: "Most operators carry a Commercial General Liability policy with $1M per-occurrence and $2M aggregate limits, with inflatables specifically listed as covered equipment. We recommend working with an insurance broker who specializes in the amusement and rental industry. We can refer you to brokers our customers have had success with.",
      },
      {
        q: "Do I need a permit to operate inflatables commercially?",
        a: "Requirements vary significantly by state and municipality. Many states require an amusement ride operator permit or registration for commercial inflatable operation. We strongly recommend contacting your state's Department of Labor or Consumer Protection office before operating commercially.",
      },
    ],
  },
  {
    section: "Maintenance & Repairs",
    faqs: [
      {
        q: "How do I maintain my inflatable to maximize its lifespan?",
        a: "Always ensure the unit is completely dry before storing, mold and mildew are the leading causes of premature inflatable failure. Inspect seams and panels after every rental. Store folded (never crumpled) in a cool, dry location. Clean with mild soap and water; never use bleach or petroleum-based solvents on the vinyl.",
      },
      {
        q: "What is the expected lifespan of a commercial inflatable?",
        a: "With proper maintenance, our commercial grade units typically last 5 to 10 years of regular rental use. We have customers who've had their units in service for 12+ years with only minor repairs. Consumer grade inflatables, by contrast, typically fail within 1 to 2 seasons of rental use.",
      },
      {
        q: "Can I repair punctures myself?",
        a: "Yes, every unit comes with a commercial patch repair kit. Small punctures (under 6 inches) can be repaired with vinyl patch cement and material in under 30 minutes. For larger tears or seam failures, contact us, we can advise on the repair or connect you with a certified repair technician in your area.",
      },
      {
        q: "What warranty do you offer?",
        a: "All products carry a 1-year limited commercial warranty covering manufacturing defects in materials and workmanship. This does not cover damage from misuse, overpressure, improper anchoring, or normal wear. Extended warranty options are available at the time of purchase.",
      },
    ],
  },
  {
    section: "Rental Business",
    faqs: [
      {
        q: "How much can I earn renting inflatables?",
        a: "Earnings vary significantly by market, pricing, and marketing effort. As a rough benchmark: a water slide renting for $500/day and booked 30 weekends per year generates $15,000 in annual revenue. Operators with fleets of 5 to 10 units in established markets commonly gross $80,000 to $200,000+ per year.",
      },
      {
        q: "What events are most profitable for rental operators?",
        a: "In order of typical profitability: corporate events and company picnics (large budgets, often repeat annually), school carnivals and church festivals (large bookings, multiple units), and birthday parties (high volume, lower individual revenue). Building relationships with event planners and school PTAs can fill your calendar quickly.",
      },
      {
        q: "Do you offer any training for new operators?",
        a: "Yes, we host quarterly virtual training sessions covering setup safety, maintenance, marketing, and pricing. All new customers are invited to our next session free of charge. We also have a library of setup videos and operational guides on our blog.",
      },
    ],
  },
];

export default function FaqPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="bg-slate-50 border-b border-slate-100">
        <div className="container-wide py-12">
          <p className="text-xs font-semibold text-orange-600 uppercase tracking-widest mb-2">
            Support
          </p>
          <h1 className="text-3xl font-bold text-slate-900">
            Frequently Asked Questions
          </h1>
          <p className="mt-2 text-slate-500 text-sm max-w-xl">
            Everything you need to know about buying, operating, and maintaining
            commercial inflatables.
          </p>
        </div>
      </div>

      <div className="container-wide py-12 lg:py-16">
        <div className="max-w-3xl">
          {FAQ_SECTIONS.map((section) => (
            <div key={section.section} className="mb-12">
              <h2 className="text-lg font-bold text-slate-900 mb-5 pb-3 border-b border-slate-100">
                {section.section}
              </h2>
              <div className="space-y-0 divide-y divide-slate-100">
                {section.faqs.map((faq) => (
                  <FaqItem key={faq.q} q={faq.q} a={faq.a} />
                ))}
              </div>
            </div>
          ))}

          {/* Still have questions */}
          <div className="mt-8 rounded-2xl bg-slate-50 border border-slate-100 p-8">
            <h3 className="text-base font-bold text-slate-900">Still have questions?</h3>
            <p className="mt-2 text-sm text-slate-500">
              Our team responds to all inquiries within 2 business hours.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link href="/contact" className="btn-primary text-sm py-2.5 px-5">
                Contact Us
              </Link>
              <a href={mailHref(BUSINESS_EMAIL)} className="btn-secondary text-sm py-2.5 px-5">
                Email us
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* JSON-LD FAQ schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: FAQ_SECTIONS.flatMap((s) =>
              s.faqs.map((faq) => ({
                "@type": "Question",
                name: faq.q,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: faq.a,
                },
              }))
            ),
          }),
        }}
      />
    </div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  return (
    <details className="group py-4">
      <summary className="flex items-start justify-between gap-4 cursor-pointer list-none">
        <span className="text-sm font-semibold text-slate-900 leading-snug">{q}</span>
        <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5 transition-transform duration-200 group-open:rotate-180" />
      </summary>
      <p className="mt-3 text-sm text-slate-600 leading-relaxed">{a}</p>
    </details>
  );
}
