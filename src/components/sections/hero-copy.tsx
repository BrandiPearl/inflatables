"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

const fade = {
  hidden: { opacity: 0, y: 18 },
  show: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export function HeroCopy() {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return (
      <div className="relative container-wide pt-16 pb-10 sm:pt-20 sm:pb-12 lg:pt-24 lg:pb-14">
        <div className="max-w-3xl">
          <p className="eyebrow !text-orange-400 !mb-4">Commercial grade since 2008</p>
          <h1 className="display-xl text-white">
            Built for the business of fun
            <span className="text-orange-500">.</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-200">
            Bounce houses, water slides, obstacle courses and combos for rental
            operators and large-scale events. ASTM certified, 18oz vinyl,
            shipping to all 48 states.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-x-8 gap-y-4">
            <Link href="/products" className="btn-primary px-7 py-4 text-[0.9375rem]">
              Browse the catalogue
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/quote"
              className="link-arrow !border-white/30 !text-white hover:!border-orange-400 hover:!text-orange-300"
            >
              Request a quote
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative container-wide pt-16 pb-10 sm:pt-20 sm:pb-12 lg:pt-24 lg:pb-14">
      <div className="max-w-3xl">
        <motion.p
          custom={0.05}
          variants={fade}
          initial="hidden"
          animate="show"
          className="eyebrow !text-orange-400 !mb-4"
        >
          Commercial grade since 2008
        </motion.p>

        <motion.h1
          custom={0.15}
          variants={fade}
          initial="hidden"
          animate="show"
          className="display-xl text-white"
        >
          Built for the business of fun
          <motion.span
            className="inline-block text-orange-500"
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 4 }}
          >
            .
          </motion.span>
        </motion.h1>

        <motion.p
          custom={0.28}
          variants={fade}
          initial="hidden"
          animate="show"
          className="mt-5 max-w-xl text-lg leading-relaxed text-slate-200"
        >
          Bounce houses, water slides, obstacle courses and combos for rental
          operators and large-scale events. ASTM certified, 18oz vinyl,
          shipping to all 48 states.
        </motion.p>

        <motion.div
          custom={0.4}
          variants={fade}
          initial="hidden"
          animate="show"
          className="mt-7 flex flex-wrap items-center gap-x-8 gap-y-4"
        >
          <Link href="/products" className="btn-primary px-7 py-4 text-[0.9375rem]">
            Browse the catalogue
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/quote"
            className="link-arrow !border-white/30 !text-white hover:!border-orange-400 hover:!text-orange-300"
          >
            Request a quote
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
