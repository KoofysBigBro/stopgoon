import type { Metadata } from "next";
import { Manrope, Sora } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Analytics } from "@vercel/analytics/react";
import PWAInit from "@/components/PWAInit";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
});

export const viewport = {
  themeColor: '#09090b',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
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
    url: "https://stopgoon.vercel.app",
    title: "StopGoon - Overcome Addiction & Build Discipline",
    description: "A recovery platform that helps you break compulsive habits and build a disciplined life.",
    siteName: "StopGoon",
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
    canonical: 'https://stopgoon.vercel.app',
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
        {process.env.NEXT_PUBLIC_ADSENSE_PUB_ID && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_PUB_ID}`}
            crossOrigin="anonymous"
          />
        )}
      </head>
      <body className="min-h-full flex flex-col font-sans smooth-ui">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <PWAInit />
          <Analytics />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
