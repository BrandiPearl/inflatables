import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";
import { getSiteSettings } from "@/lib/queries/settings";
import { mailHref } from "@/lib/utils";

export async function CtaStrip() {
  const settings = await getSiteSettings();

  return (
    <section className="bg-orange-600">
      <div className="container-wide py-12 lg:py-14">
        <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <h2 className="display-lg text-white">Not sure where to start?</h2>
            <p className="mt-4 max-w-xl text-[1.0625rem] leading-relaxed text-orange-50">
              Tell us your market, your budget and the events you book. We will
              tell you which units to buy first, and which to leave until
              next season.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row lg:col-span-5 lg:justify-end">
            <Link
              href="/quote"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-white px-7 py-4 text-[0.9375rem] font-bold text-orange-700 transition-colors hover:bg-orange-50"
            >
              Get a free quote
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href={mailHref(settings.email)}
              className="spec inline-flex items-center justify-center gap-2.5 rounded-md border border-white/35 px-7 py-4 text-sm font-medium text-white transition-colors hover:bg-white/10"
            >
              <Mail className="h-4 w-4" />
              Email us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
