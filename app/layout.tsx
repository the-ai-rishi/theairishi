import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/lib/site";
import { getBrandConfig, getSearchTopics } from "@/lib/config";
import { creatorJsonLd, websiteJsonLd } from "@/lib/seo";
import { canonicalUrl, getSiteOrigin } from "@/lib/urls";
import { getGoogleSiteVerification } from "@/lib/analytics";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

const brand = getBrandConfig();
const topicKeywords = getSearchTopics().flatMap((topic) =>
  [topic.name, topic.shortName, topic.badge].filter(Boolean)
);
const keywords = Array.from(new Set([brand.name, ...topicKeywords]));
const googleVerification = getGoogleSiteVerification();

export const metadata: Metadata = {
  metadataBase: new URL(getSiteOrigin()),

  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },

  description: siteConfig.description,

  keywords,

  authors: [
    {
      name: siteConfig.author.name,
    },
  ],

  creator: siteConfig.author.name,
  publisher: siteConfig.name,

  icons: {
    icon: brand.faviconUrl || "/icon.png",
    apple: brand.appleTouchIcon || "/apple-icon.png",
  },

  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
    url: getSiteOrigin(),
    images: [
      {
        url: brand.ogImage || "/brand/og-image.jpg",
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [brand.ogImage || "/brand/og-image.jpg"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  alternates: {
    canonical: canonicalUrl("/"),
  },

  ...(googleVerification ? { verification: { google: googleVerification } } : {}),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = [creatorJsonLd(), websiteJsonLd()];

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} h-full antialiased dark`}
    >
      <body className="flex min-h-full flex-col bg-ink font-sans text-cream/90">
        <GoogleAnalytics />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
