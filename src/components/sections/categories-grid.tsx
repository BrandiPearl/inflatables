import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getCategories } from "@/lib/queries/products";
import { ProductPhoto } from "@/components/ui/product-photo";

/**
 * Portrait tiles with the label set over the photograph. The previous
 * six-across layout cropped every product to a postage stamp and leaned on
 * per-category pastel gradients; the photography is the strongest asset here,
 * so it gets the room and the chrome stays out of its way.
 */
export async function CategoriesGrid() {
  const categories = await getCategories();

  return (
    <section className="section-block">
      <div className="container-wide">
        <div className="section-intro flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
          <div>
            <p className="eyebrow">Shop by type</p>
            <h2 className="section-heading">Find what you need</h2>
          </div>
          <p className="max-w-sm text-[0.9375rem] leading-relaxed text-slate-600">
            {categories.length} categories, from starter bounce houses to
            stadium-scale obstacle courses.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-5 sm:gap-x-5 lg:grid-cols-3 lg:gap-x-6">
          {categories.map((cat, i) => {
            const photo = cat.image_url?.startsWith("http")
              ? cat.image_url
              : undefined;

            return (
              <Link
                key={cat.id}
                href={`/products?category=${cat.slug}`}
                className="group block"
              >
                <div
                  className="relative overflow-hidden rounded-lg bg-slate-100"
                  style={{ aspectRatio: "4 / 5" }}
                >
                  <ProductPhoto
                    src={photo}
                    alt={cat.name}
                    name={cat.name}
                    category={cat.slug}
                    priority={i < 3}
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover object-center transition-transform duration-[700ms] ease-out group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/85 via-slate-900/15 to-transparent" />

                  <span className="spec absolute left-4 top-4 text-[0.625rem] tracking-[0.16em] text-white/60">
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                    <h3 className="font-display text-base font-bold leading-tight tracking-tight text-white sm:text-lg">
                      {cat.name}
                    </h3>
                    <div className="mt-1.5 flex items-center justify-between gap-2">
                      <span className="spec text-[0.6875rem] text-white/65">
                        {cat.product_count} units
                      </span>
                      <ArrowRight className="h-4 w-4 -translate-x-1 text-white opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-8 border-t border-slate-200 pt-5">
          <Link href="/products" className="link-arrow">
            View the full catalogue
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
