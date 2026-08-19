"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { HeroSlide } from "@/lib/queries/hero-slides";

const INTERVAL_MS = 5500;

export function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = slides.length;
  const active = slides[index] ?? slides[0];

  const goTo = useCallback(
    (next: number) => {
      if (count <= 1) return;
      setIndex(((next % count) + count) % count);
    },
    [count]
  );

  useEffect(() => {
    if (reduceMotion || count <= 1 || paused) return;
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % count);
    }, INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [count, paused, reduceMotion]);

  if (!active) return null;

  return (
    <div
      className="absolute inset-0"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-hidden
    >
      <AnimatePresence mode="sync" initial={false}>
        <motion.div
          key={active.src}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0.2 : 1.1, ease: "easeInOut" }}
        >
          <motion.div
            className="absolute inset-[-4%]"
            initial={{ scale: reduceMotion ? 1 : 1.04 }}
            animate={{ scale: reduceMotion ? 1 : 1.12 }}
            transition={{
              duration: reduceMotion ? 0 : INTERVAL_MS / 1000 + 0.8,
              ease: [0.25, 0.1, 0.25, 1],
            }}
          >
            <Image
              src={active.src}
              alt={active.alt}
              fill
              priority={index === 0}
              className="object-cover"
              style={{ objectPosition: active.focal ?? "center" }}
              sizes="100vw"
            />
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {count > 1 && (
        <div className="absolute bottom-24 right-4 z-20 flex items-center gap-3 sm:bottom-28 sm:right-8 lg:bottom-32">
          {active.label && (
            <motion.span
              key={active.label}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="spec hidden rounded-full border border-white/20 bg-slate-900/45 px-3 py-1 text-[0.625rem] uppercase tracking-[0.16em] text-white/75 backdrop-blur-sm sm:inline-block"
            >
              {active.label}
            </motion.span>
          )}

          <div className="flex items-center gap-2">
            {slides.map((slide, i) => (
              <button
                key={slide.src}
                type="button"
                aria-label={`Show slide ${i + 1}: ${slide.label ?? slide.alt}`}
                aria-current={i === index ? "true" : undefined}
                onClick={() => goTo(i)}
                className="group relative h-2.5 w-2.5 rounded-full bg-white/30 transition-colors hover:bg-white/55"
              >
                {i === index && (
                  <motion.span
                    layoutId="hero-dot"
                    className="absolute inset-0 rounded-full bg-orange-500"
                    transition={{ type: "spring", stiffness: 420, damping: 32 }}
                  />
                )}
                {!reduceMotion && i === index && !paused && (
                  <span
                    className="absolute inset-[-3px] rounded-full border border-orange-400/70 animate-hero-ring"
                    aria-hidden
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
