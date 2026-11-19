import type { Metadata } from "next";
import { Syne, DM_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/chrome/site-header";
import { SiteFooter } from "@/components/chrome/site-footer";
import { LiveStatus } from "@/components/ui/live-status";
import { SITE_NAME, SITE_URL } from "@/lib/site";

const display = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  display: "swap",
});

const body = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

const outlier = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const description =
  "Organic pantry goods, drinks and fresh food, priced by weight and sold by the pack.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  title: "Kraya - provisions by weight",
  description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_GB",
    siteName: SITE_NAME,
    title: "Kraya - provisions by weight",
    description,
    url: "/",
    images: [
      {
        url: "/photos/market-stall.jpg",
        width: 1280,
        height: 961,
        alt: "A sunlit market stall under green canopies, with crates of tomatoes, lemons and greens",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kraya - provisions by weight",
    description,
    images: ["/photos/market-stall.jpg"],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${outlier.variable}`}
    >
      <body className="flex min-h-dvh flex-col antialiased">
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
        <LiveStatus />
      </body>
    </html>
  );
}
