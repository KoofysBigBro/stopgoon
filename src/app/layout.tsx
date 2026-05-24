import type { Metadata } from "next";
import { Manrope, Sora } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Analytics } from "@vercel/analytics/react";
import PWAInit from "@/components/PWAInit";
import Script from "next/script";
import "./globals.css";
import CookieConsent from "@/components/CookieConsentWrapper";
import AnalyticsTracker from "@/components/AnalyticsTracker";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  display: "swap",
});

export const viewport = {
  themeColor: '#09090b',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://stopgoon.xyz'),
  title: {
    default: "StopGoon - Overcome Addiction & Build Discipline",
    template: "%s | StopGoon"
  },
  description: "StopGoon is a recovery platform that helps you break compulsive habits, track your progress, and build a healthier relationship with yourself.",
  keywords: ["addiction recovery", "nofap", "mental wellness", "stop gooning", "habit tracker", "discipline", "self improvement"],
  authors: [{ name: "StopGoon Team" }],
  creator: "StopGoon",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://stopgoon.xyz",
    title: "StopGoon - Overcome Addiction & Build Discipline",
    description: "A recovery platform that helps you break compulsive habits and build a disciplined life.",
    siteName: "StopGoon",
    images: [{ url: "/icon.svg", width: 512, height: 512 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "StopGoon - Overcome Addiction & Build Discipline",
    description: "A recovery platform that helps you break compulsive habits and build a disciplined life.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://stopgoon.xyz',
  },
  manifest: "/manifest.json",
  icons: {
    apple: "/icon.svg",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${manrope.variable} ${sora.variable} h-full antialiased`}
    >
      <head>
        <meta name="google-site-verification" content="CNsTGn3vxiIULNaxFVPxqdmB7UL9e2PvKuO5VHpdt_k" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" />
        <link rel="dns-prefetch" href="https://launchigniter.com" />
      </head>
      <body className="min-h-full flex flex-col font-sans smooth-ui">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-xl focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-white/50"
        >
          Skip to main content
        </a>

        <Script id="google-analytics-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            window.gtag = window.gtag || function gtag(){dataLayer.push(arguments);};
          `}
        </Script>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={true}
          disableTransitionOnChange
        >
          <PWAInit />
          <AnalyticsTracker />
          <Analytics />
          {children}
          <CookieConsent />
        </ThemeProvider>
      </body>
    </html>
  );
}
