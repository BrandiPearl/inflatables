export const CURRENCY_COOKIE = "wl_currency";

export const ZERO_DECIMAL = new Set([
  "BIF",
  "CLP",
  "DJF",
  "GNF",
  "ISK",
  "JPY",
  "KMF",
  "KRW",
  "PYG",
  "RWF",
  "UGX",
  "VND",
  "VUV",
  "XAF",
  "XOF",
  "XPF",
]);

const EU = [
  "AT", "BE", "HR", "CY", "EE", "FI", "FR", "DE", "GR", "IE", "IT", "LV", "LT",
  "LU", "MT", "NL", "PT", "SK", "SI", "ES",
];

const COUNTRY_CURRENCY: Record<string, string> = {
  US: "USD",
  CA: "CAD",
  MX: "MXN",
  BR: "BRL",
  AR: "ARS",
  CL: "CLP",
  CO: "COP",
  PE: "PEN",
  GB: "GBP",
  CH: "CHF",
  SE: "SEK",
  NO: "NOK",
  DK: "DKK",
  PL: "PLN",
  CZ: "CZK",
  HU: "HUF",
  RO: "RON",
  TR: "TRY",
  UA: "UAH",
  RU: "RUB",
  AU: "AUD",
  NZ: "NZD",
  JP: "JPY",
  CN: "CNY",
  HK: "HKD",
  TW: "TWD",
  KR: "KRW",
  SG: "SGD",
  MY: "MYR",
  TH: "THB",
  ID: "IDR",
  PH: "PHP",
  VN: "VND",
  IN: "INR",
  PK: "PKR",
  BD: "BDT",
  LK: "LKR",
  AE: "AED",
  SA: "SAR",
  QA: "QAR",
  KW: "KWD",
  IL: "ILS",
  EG: "EGP",
  MA: "MAD",
  ZA: "ZAR",
  NG: "NGN",
  GH: "GHS",
  KE: "KES",
  TZ: "TZS",
  UG: "UGX",
  RW: "RWF",
  ET: "ETB",
  CM: "XAF",
  CF: "XAF",
  TD: "XAF",
  CG: "XAF",
  GQ: "XAF",
  GA: "XAF",
  SN: "XOF",
  CI: "XOF",
  ML: "XOF",
  BF: "XOF",
  NE: "XOF",
  TG: "XOF",
  BJ: "XOF",
  GW: "XOF",
};

for (const code of EU) COUNTRY_CURRENCY[code] = "EUR";

export const PICKER_CURRENCIES = [
  "USD",
  "EUR",
  "GBP",
  "CAD",
  "XAF",
  "XOF",
  "NGN",
  "GHS",
  "ZAR",
  "KES",
  "AED",
  "INR",
  "AUD",
  "JPY",
];

export function currencyForCountry(country?: string | null) {
  if (!country) return "USD";
  return COUNTRY_CURRENCY[country.toUpperCase()] ?? "USD";
}

export function formatMoney(amountUsd: number, currency: string, rate = 1) {
  const converted = amountUsd * (Number.isFinite(rate) && rate > 0 ? rate : 1);
  const digits = ZERO_DECIMAL.has(currency) ? 0 : 2;
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    }).format(converted);
  } catch {
    return `${currency} ${converted.toFixed(digits)}`;
  }
}

export function toUsd(localAmount: number, rate = 1) {
  if (!rate || rate <= 0) return localAmount;
  return localAmount / rate;
}

/** Replace $2,500 style amounts in marketing copy with the visitor's currency. */
export function localizeUsdAmountsInText(
  text: string,
  format: (usdAmount: number) => string
) {
  return text.replace(/\$\s*([\d,]+(?:\.\d+)?)/g, (_, raw: string) => {
    const usd = Number(raw.replace(/,/g, ""));
    if (!Number.isFinite(usd)) return `$${raw}`;
    return format(usd);
  });
}
