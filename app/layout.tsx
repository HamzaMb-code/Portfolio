import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { profile } from "@/lib/content";
import { LenisProvider } from "@/components/lenis-provider";
import { Cursor } from "@/components/cursor";
import { NoiseOverlay } from "@/components/noise-overlay";
import { FluidCanvas } from "@/components/fluid-canvas";
import { Loader } from "@/components/loader";
import { PixelWipe } from "@/components/page-transition";
import { SiteHeader } from "@/components/site-header";
import { SiteMenu } from "@/components/site-menu";
import { SiteFooter } from "@/components/site-footer";

const hanken = localFont({
  src: "./fonts/HankenGrotesk-Latin.woff2",
  variable: "--font-display",
  weight: "400 800",
  display: "swap",
});

const siteUrl = `https://${profile.domain}`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${profile.name} — ${profile.role}`,
    template: `%s — ${profile.name}`,
  },
  description: `${profile.name} is a ${profile.role.toLowerCase()} building interfaces and the design systems behind them.`,
  keywords: ["UI design", "UX design", "design systems", "product design", "portfolio"],
  openGraph: {
    title: `${profile.name} — ${profile.role}`,
    description: `Portfolio of ${profile.name}, ${profile.role.toLowerCase()}.`,
    siteName: profile.name,
    url: siteUrl,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.name} — ${profile.role}`,
    description: `Portfolio of ${profile.name}, ${profile.role.toLowerCase()}.`,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${hanken.variable} h-full antialiased`}>
      <body className="site min-h-full flex flex-col">
        <LenisProvider>
          <Loader />
          <NoiseOverlay />
          <FluidCanvas />
          <Cursor />
          <PixelWipe />
          <SiteHeader />
          <SiteMenu />
          {children}
          <SiteFooter />
        </LenisProvider>
      </body>
    </html>
  );
}
