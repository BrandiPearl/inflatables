"use client";

import { PICKER_CURRENCIES } from "@/lib/currency";
import { useCurrency } from "@/components/currency/currency-provider";

export function CurrencySelect() {
  const { currency, setCurrency } = useCurrency();
  const options = PICKER_CURRENCIES.includes(currency)
    ? PICKER_CURRENCIES
    : [currency, ...PICKER_CURRENCIES];

  return (
    <label>
      <span className="sr-only">Currency</span>
      <select
        aria-label="Currency"
        title="Prices shown in your currency. Orders are quoted in USD."
        value={currency}
        onChange={(e) => setCurrency(e.target.value)}
        className="text-xs font-semibold text-slate-600 bg-transparent border border-slate-200 rounded-md px-1.5 py-1 hover:border-slate-300 focus:outline-none focus:border-orange-400"
      >
        {options.map((code) => (
          <option key={code} value={code}>
            {code}
          </option>
        ))}
      </select>
    </label>
  );
}
