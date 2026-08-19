/**
 * Deliberately icon-free. A six-up grid of icons in tinted rounded squares is
 * the default shape of generated marketing pages; numerals and hairline rules
 * carry the same structure while reading as an editorial spec list.
 */

const REASONS = [
  {
    title: "Commercial grade build",
    body: "18oz PVC vinyl, quadruple stitched seams and reinforced anchor points. The same specification the largest rental fleets in the US run.",
  },
  {
    title: "ASTM & CPSC compliant",
    body: "Every unit meets or exceeds ASTM F2374 and CPSC standards. Certification documents ship with the order, ready for your insurer.",
  },
  {
    title: "Freight to 48 states",
    body: "LTL freight anywhere in the contiguous US. Most orders leave the Ontario, CA warehouse within three to five business days.",
  },
  {
    title: "Kitted, not bare",
    body: "Blowers, stakes, storage bag and a commercial repair kit are in the crate. Nothing else to source before your first booking.",
  },
  {
    title: "Operators on the phone",
    body: "Our team has fifteen years in the rental trade. We will tell you which units suit your market, including when to buy less.",
  },
  {
    title: "Single-season payback",
    body: "Popular units rent at $300 to $800 per day. Most operators clear their investment inside one summer.",
  },
];

export function WhyUs() {
  return (
    <section className="section-block border-y border-slate-200 bg-slate-50">
      <div className="container-wide">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <p className="eyebrow">Why Wonderland</p>
              <h2 className="section-heading">
                The choice of serious rental operators
              </h2>
              <p className="section-subheading">
                From one starter unit to a fleet of fifty, we have helped
                operators at every stage build something that pays for itself.
              </p>
            </div>
          </div>

          <div className="lg:col-span-8">
            <div className="grid gap-x-10 gap-y-0 sm:grid-cols-2">
              {REASONS.map((reason, i) => (
                <div
                  key={reason.title}
                  className="group border-t border-slate-300 py-5 first:border-slate-900 sm:[&:nth-child(2)]:border-slate-900"
                >
                  <span className="spec text-[0.6875rem] font-medium tracking-[0.14em] text-orange-700">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-3 font-display text-lg font-bold tracking-tight text-slate-900">
                    {reason.title}
                  </h3>
                  <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-slate-600">
                    {reason.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
