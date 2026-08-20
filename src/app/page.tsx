import type { Metadata } from "next";
import { Hero } from "@/components/sections/hero";
import { CategoriesGrid } from "@/components/sections/categories-grid";
import { FeaturedProducts } from "@/components/sections/featured-products";
import { WhyUs } from "@/components/sections/why-us";
import { Testimonials } from "@/components/sections/testimonials";
import { CtaStrip } from "@/components/sections/cta-strip";
import { BlogPreview } from "@/components/sections/blog-preview";
import { getSiteSettings } from "@/lib/queries/settings";

export const metadata: Metadata = {
  title: "Wonderland Inflatables | Commercial Bounce Houses & Water Slides for Sale",
  description:
    "Shop commercial grade bounce houses, water slides, obstacle courses, and combo inflatables. Built for rental businesses. Ships to all 48 states. ASTM certified.",
  alternates: {
    canonical: "https://wonderlandinflatables.com",
  },
};

export default async function HomePage() {
  const settings = await getSiteSettings();

  return (
    <>
      <Hero />
      <CategoriesGrid />
      <FeaturedProducts />
      <WhyUs />
      <Testimonials />
      <CtaStrip />
      <BlogPreview />

      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Store",
            name: "Wonderland Inflatables",
            description:
              "Commercial grade inflatable bounce houses, water slides, and obstacle courses for rental businesses and large events.",
            url: "https://wonderlandinflatables.com",
            email: settings.email,
            openingHoursSpecification: [
              {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                opens: "08:00",
                closes: "18:00",
              },
            ],
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: "4.9",
              reviewCount: "2400",
            },
          }),
        }}
      />
    </>
  );
}
