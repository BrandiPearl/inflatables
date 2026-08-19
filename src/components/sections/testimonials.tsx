import { Star } from "lucide-react";
import { getTestimonials } from "@/lib/queries/testimonials";

/**
 * Editorial pull quotes on ink. The lead review is set large and given the
 * full measure; the rest sit under it in ruled columns. No avatar bubbles
 * with initials, no tinted quote cards.
 */
export async function Testimonials() {
  const testimonials = await getTestimonials(4);
  if (testimonials.length === 0) return null;

  const [lead, ...rest] = testimonials;

  return (
    <section className="section-block bg-slate-900">
      <div className="container-wide">
        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-5">
          <div>
            <p className="eyebrow !text-orange-400">Customer reviews</p>
            <h2 className="section-heading !text-white">
              Trusted by operators nationwide
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex gap-0.5">
              {[0, 1, 2, 3, 4].map((s) => (
                <Star key={s} className="h-4 w-4 fill-orange-500 text-orange-500" />
              ))}
            </div>
            <span className="spec text-sm text-white">4.9</span>
            <span className="spec text-xs text-white/45">2,400+ reviews</span>
          </div>
        </div>

        <figure className="mt-8 border-t border-white/15 pt-6">
          <blockquote className="max-w-4xl font-display text-2xl font-semibold leading-[1.3] tracking-tight text-white sm:text-[2rem]">
            &ldquo;{lead.review}&rdquo;
          </blockquote>
          <figcaption className="mt-5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="text-sm font-semibold text-white">{lead.name}</span>
            <span className="spec text-xs text-white/45">
              {lead.event_type} · {lead.location}
            </span>
          </figcaption>
        </figure>

        {rest.length > 0 && (
          <div className="mt-10 grid gap-x-8 gap-y-0 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((t) => (
              <figure key={t.id} className="border-t border-white/15 py-6">
                <div className="mb-4 flex gap-0.5">
                  {Array.from({ length: t.rating }).map((_, s) => (
                    <Star
                      key={s}
                      className="h-3 w-3 fill-orange-500 text-orange-500"
                    />
                  ))}
                </div>
                <blockquote className="text-[0.9375rem] leading-relaxed text-slate-300">
                  &ldquo;{t.review}&rdquo;
                </blockquote>
                <figcaption className="mt-5 flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                  <span className="text-sm font-semibold text-white">{t.name}</span>
                  <span className="spec text-[0.6875rem] text-white/40">
                    {t.location}
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
