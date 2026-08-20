import type { Metadata } from "next";
import { QuoteForm } from "./quote-form";
import { Mail, Clock, CheckCircle2 } from "lucide-react";
import { getSiteSettings } from "@/lib/queries/settings";

export const metadata: Metadata = {
  title: "Get a Free Quote",
  description:
    "Request a free, no obligation quote from Wonderland Inflatables. Tell us about your event or rental business goals and we'll build a custom recommendation.",
};

export default async function QuotePage() {
  const settings = await getSiteSettings();

  return (
    <div className="bg-white">
      {/* Header */}
      <div className="bg-slate-900 py-14">
        <div className="container-wide">
          <div className="max-w-xl">
            <p className="text-xs font-semibold text-orange-500 uppercase tracking-widest mb-2">
              Free Consultation
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold text-white">
              Get a custom quote
            </h1>
            <p className="mt-3 text-slate-400 text-base leading-relaxed">
              Whether you're buying your first inflatable or expanding a fleet, our
              team will help you choose the right units for your market and budget.
            </p>
          </div>
        </div>
      </div>

      <div className="container-wide py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 xl:gap-16">
          {/* Form */}
          <div className="lg:col-span-2">
            <QuoteForm />
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Contact info */}
            <div>
              <h2 className="text-base font-bold text-slate-900 mb-4">
                Prefer to email?
              </h2>
              <div className="space-y-3">
                <a
                  href={`mailto:${settings.email}`}
                  className="flex items-center gap-3 text-sm text-slate-700 hover:text-orange-600 transition-colors"
                >
                  <div className="w-9 h-9 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-4 h-4 text-orange-600" />
                  </div>
                  <div>
                    <div className="font-semibold">{settings.email}</div>
                    <div className="text-xs text-slate-500">Reply within 2 hours</div>
                  </div>
                </a>
                <div className="flex items-center gap-3 text-sm text-slate-700">
                  <div className="w-9 h-9 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-4 h-4 text-orange-600" />
                  </div>
                  <div>
                    <div className="font-semibold">Mon-Fri, 8am-6pm PST</div>
                    <div className="text-xs text-slate-500">Business hours</div>
                  </div>
                </div>
              </div>
            </div>

            {/* What to expect */}
            <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 mb-4">
                What happens next?
              </h3>
              <ul className="space-y-3">
                {[
                  "We review your request within 2 business hours",
                  "A product expert will contact you to discuss your goals",
                  "You receive a detailed quote with product recommendations",
                  "No pressure, take as long as you need to decide",
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    {step}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
