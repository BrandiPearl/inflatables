import type { Metadata } from "next";
import { Inter, Archivo, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/layout/app-shell";
import { getSiteSettings } from "@/lib/queries/settings";
import { getRequestCurrencyHint } from "@/lib/request-currency";

// Body copy. Deliberately invisible — it carries the reading, not the voice.
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

// Display. The `wdth` axis is the point: headlines are set slightly extended,
// which is what gives them the confident, catalogue-cover weight.
const archivo = Archivo({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-archivo",
  weight: "variable",
  axes: ["wdth"],
});

// Specs, dimensions, SKUs and stat figures. Equipment buyers read numbers,
// and numbers set in mono read as measured rather than marketed.
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://wonderlandinflatables.com"),
  title: {
    default: "Wonderland Inflatables | Commercial Bounce Houses & Water Slides",
    template: "%s | Wonderland Inflatables",
  },
  description:
    "Commercial grade bounce houses, water slides, obstacle courses, and combos for rental businesses and large events. Built to last. Ships nationwide.",
  keywords: [
    "commercial bounce houses",
    "inflatable water slides for sale",
    "inflatable rental business",
    "obstacle courses for sale",
    "bounce house manufacturer",
    "commercial inflatables",
    "party inflatables",
    "inflatable combos",
  ],
  authors: [{ name: "Wonderland Inflatables" }],
  creator: "Wonderland Inflatables",
  publisher: "Wonderland Inflatables",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://wonderlandinflatables.com",
    siteName: "Wonderland Inflatables",
    title: "Wonderland Inflatables | Commercial Bounce Houses & Water Slides",
    description:
      "Commercial grade inflatables for rental businesses and large events. Ships nationwide.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Wonderland Inflatables",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Wonderland Inflatables",
    description: "Commercial grade inflatables for rental businesses and large events.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
  icons: {
    icon: [
      { url: "/icon", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, hint] = await Promise.all([getSiteSettings(), getRequestCurrencyHint()]);

  return (
    <html lang="en" className={`${inter.variable} ${archivo.variable} ${jetbrains.variable}`}>
      <head>
        <link rel="canonical" href="https://wonderlandinflatables.com" />
      </head>
      <body className="font-sans antialiased bg-white text-slate-900">
        <AppShell
          settings={settings}
          initialCountry={hint.country}
          initialCurrency={hint.cookieCurrency || (hint.country ? hint.detectedCurrency : "")}
        >
          {children}
        </AppShell>
      </body>
    </html>
  );
}
