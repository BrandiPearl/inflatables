"use client";

import { useState } from "react";
import Image from "next/image";

interface CoverImageProps {
  src?: string | null;
  alt: string;
  sizes: string;
  className?: string;
  fallbackLabel?: string;
}

export function CoverImage({
  src,
  alt,
  sizes,
  className = "object-cover",
  fallbackLabel = "Article",
}: CoverImageProps) {
  const [failed, setFailed] = useState(false);
  const usable = Boolean(src) && !failed;
  const remote = Boolean(src?.startsWith("http"));

  if (!usable) {
    return (
      <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
        <span className="text-slate-400 text-xs font-medium">{fallbackLabel}</span>
      </div>
    );
  }

  return (
    <Image
      src={src!}
      alt={alt}
      fill
      sizes={sizes}
      className={className}
      unoptimized={remote}
      onError={() => setFailed(true)}
    />
  );
}
