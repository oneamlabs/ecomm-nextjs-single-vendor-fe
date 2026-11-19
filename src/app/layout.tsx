import type { Metadata } from "next";
import { Fraunces, DM_Sans } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/chrome/site-header";
import { SiteFooter } from "@/components/chrome/site-footer";
import { LiveStatus } from "@/components/ui/live-status";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

const display = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

const body = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  title: "Kraya - organic marketplace",
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: SITE_NAME,
    title: "Kraya - organic marketplace",
    description: SITE_DESCRIPTION,
    url: "/",
    images: [
      {
        url: "/photos/market-stall.jpg",
        width: 1280,
        height: 961,
        alt: "A sunlit market stall under green canopies, with crates of produce",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kraya - organic marketplace",
    description: SITE_DESCRIPTION,
    images: ["/photos/market-stall.jpg"],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
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
