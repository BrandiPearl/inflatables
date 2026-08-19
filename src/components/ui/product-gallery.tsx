"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { ProductImage } from "@/types";
import { ProductPhoto } from "./product-photo";

interface ProductGalleryProps {
  images: ProductImage[];
  name: string;
  category: string;
  isNew?: boolean;
}

export function ProductGallery({
  images,
  name,
  category,
  isNew = false,
}: ProductGalleryProps) {
  const [active, setActive] = useState(0);
  const current = images[active] ?? images[0];
  const thumbs = images.slice(0, 8);

  return (
    <div className="space-y-3">
      <div
        className="relative w-full overflow-hidden rounded-2xl bg-slate-100"
        style={{ aspectRatio: "4 / 3" }}
      >
        <ProductPhoto
          key={current?.url ?? "empty"}
          src={current?.url}
          alt={current?.alt ?? name}
          name={name}
          category={category}
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
        />
        {isNew && (
          <div className="absolute top-4 left-4">
            <span className="badge-orange">New Arrival</span>
          </div>
        )}
      </div>

      {thumbs.length > 1 && (
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
          {thumbs.map((img, i) => (
            <button
              key={img.id || img.url}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`View photo ${i + 1}`}
              className={cn(
                "relative aspect-square w-full overflow-hidden rounded-lg bg-slate-100 border-2 transition-colors",
                i === active
                  ? "border-orange-500"
                  : "border-slate-200 hover:border-orange-300"
              )}
            >
              <ProductPhoto
                src={img.url}
                alt={img.alt || `${name} photo ${i + 1}`}
                name={name}
                category={category}
                sizes="120px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
