import { NextResponse } from "next/server";

const RATES_URL = "https://open.er-api.com/v6/latest/USD";

export const revalidate = 21600;

export async function GET() {
  try {
    const res = await fetch(RATES_URL, { next: { revalidate: 21600 } });
    if (!res.ok) {
      return NextResponse.json({ base: "USD", rates: { USD: 1 } }, { status: 200 });
    }
    const data = (await res.json()) as { rates?: Record<string, number> };
    return NextResponse.json({
      base: "USD",
      rates: { USD: 1, ...(data.rates ?? {}) },
    });
  } catch {
    return NextResponse.json({ base: "USD", rates: { USD: 1 } }, { status: 200 });
  }
}
