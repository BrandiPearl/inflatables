import { getHeroSlides } from "@/lib/queries/hero-slides";
import { HeroCarousel } from "@/components/sections/hero-carousel";
import { HeroCopy } from "@/components/sections/hero-copy";

/**
 * Catalogue-cover hero: rotating product photography, warm scrim,
 * oversized display type, and a spec rail at the base.
 */

const STATS = [
  { label: "Manufacturing", value: "15", unit: "yrs" },
  { label: "Units delivered", value: "12,000", unit: "+" },
  { label: "States served", value: "48", unit: "" },
  { label: "Vinyl grade", value: "18", unit: "oz" },
];

export async function Hero() {
  const slides = await getHeroSlides();

  return (
    <section className="relative isolate min-h-[480px] overflow-hidden bg-slate-900 sm:min-h-[520px] lg:min-h-[580px]">
      <HeroCarousel slides={slides} />

      {/* Scrim. Left-heavy so copy stays readable while the carousel shows through on the right. */}
      <div className="pointer-events-none absolute inset-0 bg-slate-900/55 sm:bg-slate-900/45" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/85 to-slate-900/15" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent" />

      <HeroCopy />

      <div className="relative border-t border-white/12 bg-slate-900/35 backdrop-blur-[2px]">
        <div className="container-wide">
          <dl className="grid grid-cols-2 sm:grid-cols-4">
            {STATS.map((stat, i) => (
              <div
                key={stat.label}
                className={[
                  "py-4 sm:py-5",
                  i % 2 === 1 ? "pl-6 border-l border-white/12" : "",
                  i > 0 ? "sm:pl-8 sm:border-l sm:border-white/12" : "",
                  i === 2 ? "border-l-0 pl-0 sm:pl-8 sm:border-l" : "",
                  i >= 2 ? "border-t border-white/12 sm:border-t-0" : "",
                ].join(" ")}
              >
                <dt className="spec text-[0.625rem] uppercase tracking-[0.18em] text-white/45">
                  {stat.label}
                </dt>
                <dd className="mt-2 font-display display-wide text-3xl font-extrabold leading-none text-white sm:text-4xl">
                  {stat.value}
                  {stat.unit && (
                    <span className="ml-1 text-lg font-medium text-orange-400">
                      {stat.unit}
                    </span>
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
