import type { Metadata } from "next";
import { inter } from "@/config/fonts";
import "./globals.css";
import { MetaPixel, Providers } from "@/components";

export const metadata: Metadata = {
  title: {
    template: "%s | Vibra Lover",
    default: "Vibra Lover — Sex Shop Online Uruguay",
  },
  description:
    "Sex shop online en Uruguay. Juguetes sexuales, lubricantes, accesorios y más. Envíos discretos a todo el país. Comprá con total privacidad.",
  keywords: [
    "sex shop uruguay",
    "sex shop",
    "vibradores",
    "sex toy",
    "sex shop vibrador",
    "sex shop montevideo",
    "juguetes sexuales uruguay",
    "sex shop online",
    "vibrador uruguay",
    "dados eroticos",
    "juegos sexuales",
    "lubricante",
    "tienda erótica uruguay",
    "envío discreto uruguay",
  ],
  authors: [{ name: "Vibra Lover" }],
  creator: "Vibra Lover",
  publisher: "Vibra Lover",
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
  openGraph: {
    type: "website",
    locale: "es_UY",
    url: "https://vibralover.com",
    siteName: "Vibra Lover",
    title: "Vibra Lover — Sex Shop Online Uruguay",
    description:
      "Sex shop online en Uruguay. Juguetes sexuales, lubricantes y accesorios. Envíos discretos a todo el país.",
    images: [
      {
        url: "https://vibralover.com/og-image.jpg", // 1200x630px
        width: 1200,
        height: 630,
        alt: "Vibra Lover Sex Shop Uruguay",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vibra Lover — Sex Shop Online Uruguay",
    description: "Sex shop online en Uruguay. Envíos discretos a todo el país.",
    images: ["https://vibralover.com/og-image.jpg"],
  },
  alternates: {
    canonical: "https://vibralover.com",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  metadataBase: new URL("https://vibralover.com"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <MetaPixel />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}