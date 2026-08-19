"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ProductImagePlaceholder } from "./product-image-placeholder";

interface ProductPhotoProps {
  src?: string;
  alt: string;
  name: string;
  category: string;
  priority?: boolean;
  sizes: string;
  className?: string;
}

/**
 * Supplier catalogue photography ships with a ~1%-per-edge orange keyline
 * burned into the JPEG. Remote images are therefore overscaled a hair inside
 * a clipping frame so that border falls outside the crop. The scale lives on
 * the wrapper, leaving the caller's own transform (hover zoom) free to
 * compose on the image itself.
 */
const REMOTE_TRIM = "scale(1.035)";

export function ProductPhoto({
  src,
  alt,
  name,
  category,
  priority = false,
  sizes,
  className = "object-cover",
}: ProductPhotoProps) {
  const [failed, setFailed] = useState(false);
  const remote = Boolean(src?.startsWith("http"));

  useEffect(() => {
    setFailed(false);
  }, [src]);

  if (!src || failed) {
    return <ProductImagePlaceholder name={name} category={category} />;
  }

  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={remote ? { transform: REMOTE_TRIM } : undefined}
    >
      {remote ? (
        // Remote catalog photos: native img fills the frame reliably.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          className={cn(
            "absolute inset-0 h-full w-full object-cover object-center",
            className
          )}
          onError={() => setFailed(true)}
        />
      ) : (
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          className={cn("object-cover object-center", className)}
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}
