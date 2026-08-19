"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";

export function SearchDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!open) return;
    setQuery("");
    const timer = window.setTimeout(() => inputRef.current?.focus(), 20);
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const value = query.trim();
    onClose();
    router.push(value ? `/products?q=${encodeURIComponent(value)}` : "/products");
  }

  return (
    <div className="fixed inset-0 z-[70]">
      <button aria-label="Close search" className="absolute inset-0 bg-slate-900/40" onClick={onClose} />
      <div className="relative mx-auto mt-24 w-full max-w-lg px-4">
        <form onSubmit={submit} className="bg-white rounded-2xl shadow-xl border border-slate-100 p-4">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search bounce houses, slides, SKUs…"
              className="flex-1 text-sm outline-none"
            />
            <button type="button" onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700" aria-label="Close">
              <X className="w-4 h-4" />
            </button>
          </div>
          <button type="submit" className="btn-primary w-full mt-3 text-sm py-2">
            Search catalog
          </button>
        </form>
      </div>
    </div>
  );
}
