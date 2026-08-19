"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { CURRENCY_COOKIE, currencyForCountry, formatMoney, toUsd } from "@/lib/currency";

type CurrencyContextValue = {
  currency: string;
  country: string;
  rate: number;
  ready: boolean;
  format: (usdAmount: number) => string;
  toUsd: (localAmount: number) => number;
  setCurrency: (code: string) => void;
};

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

function writeCookie(currency: string) {
  document.cookie = `${CURRENCY_COOKIE}=${currency}; path=/; max-age=31536000; samesite=lax`;
}

export function CurrencyProvider({
  initialCountry,
  initialCurrency,
  children,
}: {
  initialCountry?: string;
  initialCurrency?: string;
  children: ReactNode;
}) {
  const [country, setCountry] = useState(initialCountry ?? "");
  const [currency, setCurrencyState] = useState(initialCurrency || "USD");
  const [rates, setRates] = useState<Record<string, number>>({ USD: 1 });
  const [ready, setReady] = useState(Boolean(initialCurrency));

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const ratesRes = await fetch("/api/rates")
        .then((res) => res.json())
        .catch(() => ({ rates: { USD: 1 } }));
      if (cancelled) return;
      const nextRates = { USD: 1, ...(ratesRes.rates ?? {}) };
      setRates(nextRates);

      if (initialCurrency) {
        writeCookie(initialCurrency);
        setReady(true);
        return;
      }

      let detected = initialCountry || "";
      if (!detected) {
        try {
          const geo = await fetch("https://ipwho.is/?fields=country_code,success").then((res) =>
            res.json()
          );
          if (geo?.success && geo.country_code) detected = String(geo.country_code).toUpperCase();
        } catch {
          detected = "";
        }
      }
      if (cancelled) return;
      if (detected) setCountry(detected);
      const next = currencyForCountry(detected);
      setCurrencyState(next);
      writeCookie(next);
      setReady(true);
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [initialCountry, initialCurrency]);

  const setCurrency = useCallback((code: string) => {
    const next = code.toUpperCase();
    setCurrencyState(next);
    writeCookie(next);
  }, []);

  const rate = rates[currency] ?? 1;

  const value = useMemo(
    () => ({
      currency,
      country,
      rate,
      ready,
      format: (usdAmount: number) => formatMoney(usdAmount, currency, rate),
      toUsd: (localAmount: number) => toUsd(localAmount, rate),
      setCurrency,
    }),
    [currency, country, rate, ready, setCurrency]
  );

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) {
    throw new Error("useCurrency must be used inside CurrencyProvider");
  }
  return ctx;
}
